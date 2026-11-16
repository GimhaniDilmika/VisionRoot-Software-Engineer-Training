/**
 * Operations and Operational Health Unit Tests — Day 09 Part 05
 *
 * Tests:
 * 1. Database health-check probe (checkDatabaseConnection) for both healthy
 *    and simulated connection-failure states in isolation.
 * 2. Graceful pool drain and shutdown behavior (closePool).
 * 3. Centralized error handler production safety (suppressing internal messages/stacks).
 * 4. Request logger non-leakage verification (does not output request body or secrets).
 */

const mockClientQuery = jest.fn();
const mockClientRelease = jest.fn();
const mockPoolConnect = jest.fn();
const mockPoolEnd = jest.fn();
const mockPoolOn = jest.fn();

jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      connect: mockPoolConnect,
      end: mockPoolEnd,
      on: mockPoolOn,
      query: jest.fn(),
    })),
  };
});

import { checkDatabaseConnection, closePool } from '../../src/infrastructure/database/pool';
import { errorHandler } from '../../src/middleware/error-handler';
import { requestLogger } from '../../src/middleware/request-logger';
import { Request, Response, NextFunction } from 'express';

describe('Operational Health Checks & Pool Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClientRelease.mockReset();
    mockClientQuery.mockReset();
    mockPoolConnect.mockReset();
    mockPoolEnd.mockReset();
  });

  describe('checkDatabaseConnection', () => {
    test('returns connected: true with latency_ms when SELECT 1 succeeds', async () => {
      mockClientQuery.mockResolvedValueOnce({ rows: [{ health: 1 }] });
      mockPoolConnect.mockResolvedValueOnce({
        query: mockClientQuery,
        release: mockClientRelease,
      });

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(true);
      expect(typeof result.latency_ms).toBe('number');
      expect(result.database).toBeDefined();
      expect(mockPoolConnect).toHaveBeenCalledTimes(1);
      expect(mockClientQuery).toHaveBeenCalledWith('SELECT 1 AS health');
      expect(mockClientRelease).toHaveBeenCalledTimes(1);
    });

    test('returns connected: false with error description when client connect fails', async () => {
      mockPoolConnect.mockRejectedValueOnce(new Error('Connection terminated unexpectedly'));

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Connection terminated unexpectedly');
      expect(result.database).toBeDefined();
      expect(mockClientRelease).not.toHaveBeenCalled();
    });

    test('returns connected: false and releases client if probe query fails after connection', async () => {
      mockClientQuery.mockRejectedValueOnce(new Error('Query timeout'));
      mockPoolConnect.mockResolvedValueOnce({
        query: mockClientQuery,
        release: mockClientRelease,
      });

      const result = await checkDatabaseConnection();

      expect(result.connected).toBe(false);
      expect(result.error).toBe('Query timeout');
      expect(mockClientRelease).toHaveBeenCalledTimes(1);
    });
  });

  describe('closePool — Graceful Shutdown', () => {
    test('drains active pool clients via pool.end()', async () => {
      mockPoolEnd.mockResolvedValueOnce(undefined);

      await expect(closePool()).resolves.toBeUndefined();
      expect(mockPoolEnd).toHaveBeenCalledTimes(1);
    });

    test('safely catches pool.end() rejection without throwing unhandled exception', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPoolEnd.mockRejectedValueOnce(new Error('Pool already closed'));

      await expect(closePool()).resolves.toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});

describe('Operational Error Handling and Logging Safety', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  describe('errorHandler in production mode', () => {
    test('sanitizes error message and suppresses internal exception details from client envelope', () => {
      process.env.NODE_ENV = 'production';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockReq = {} as Request;
      const jsonMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      const mockRes = { status: statusMock } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      const sensitiveError = new Error('Database password failed for user postgres at 10.0.0.1');

      errorHandler(sensitiveError, mockReq, mockRes, mockNext);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred. Please try again later.',
          },
        })
      );
      // Ensure the sensitive message was not delivered to client
      expect(jsonMock.mock.calls[0][0].error.message).not.toContain('Database password');
      consoleErrorSpy.mockRestore();
    });

    test('preserves error message in non-production mode for developer ergonomics', () => {
      process.env.NODE_ENV = 'development';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockReq = {} as Request;
      const jsonMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      const mockRes = { status: statusMock } as unknown as Response;
      const mockNext = jest.fn() as NextFunction;

      const devError = new Error('Explicit validation condition failed');

      errorHandler(devError, mockReq, mockRes, mockNext);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Explicit validation condition failed',
          },
        })
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('requestLogger operational security', () => {
    test('logs HTTP metadata without serializing or outputting request body or secrets', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      let finishCallback: () => void = () => {};
      const mockReq = {
        method: 'POST',
        originalUrl: '/api/requests',
        body: {
          title: 'Laptop display repair',
          sensitiveInternalNote: 'Top secret credentials 12345',
        },
      } as unknown as Request;

      const mockRes = {
        statusCode: 201,
        on: jest.fn().mockImplementation((event: string, cb: () => void) => {
          if (event === 'finish') {
            finishCallback = cb;
          }
        }),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      requestLogger(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      // Trigger finish event to invoke logger output
      finishCallback();

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedString = consoleLogSpy.mock.calls[0][0];

      // Verify metadata logged
      expect(loggedString).toContain('[INFO]');
      expect(loggedString).toContain('POST /api/requests');
      expect(loggedString).toContain('201');

      // Verify body and sensitive details NOT logged
      expect(loggedString).not.toContain('sensitiveInternalNote');
      expect(loggedString).not.toContain('Top secret credentials');
      consoleLogSpy.mockRestore();
    });
  });
});
