import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file if available
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Root endpoint - Environment readiness check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'VisionRoot Service Request Management System API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Basic health check endpoint placeholder
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
    },
  });
});

// Start server only when directly run
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[VisionRoot Backend] Server initialized in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`[VisionRoot Backend] Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;

