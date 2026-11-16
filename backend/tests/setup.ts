/**
 * Jest Global Test Environment Setup
 *
 * Ensures all test executions run strictly with NODE_ENV='test'.
 * Protects the development PostgreSQL database by overriding database environment variables
 * with mock/test parameters so tests never inadvertently connect to development data.
 */

process.env.NODE_ENV = 'test';
process.env.PORT = '5099';
process.env.DB_NAME = 'visionroot_service_requests_test_mock';
process.env.CORS_ORIGIN = 'http://localhost:3000';
