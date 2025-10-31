import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AuthController } from './src/controllers/authController';
import { AdminController } from './src/controllers/adminController';
import { authenticateToken, requireAdmin } from './src/middlewares/auth';
import { errorHandler } from './src/middlewares/error';
import { authRateLimiter, generalRateLimiter, strictRateLimiter } from './src/middlewares/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize controllers
const authController = new AuthController();
const adminController = new AdminController();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SMS Admin Backend is running' });
});

// Development endpoint to clear rate limits (remove in production)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/dev/clear-rate-limits', (req, res) => {
    // Clear all rate limit entries
    authRateLimiter.clear();
    generalRateLimiter.clear();
    strictRateLimiter.clear();
    res.json({ message: 'Rate limits cleared' });
  });
}

// Authentication routes (with strict rate limiting) - Admin login only
app.post('/api/auth/login', authRateLimiter.middleware, authController.login);
app.post('/api/auth/logout', generalRateLimiter.middleware, authController.logout);
app.get('/api/auth/me', generalRateLimiter.middleware, authenticateToken, authController.getCurrentUser);

// Admin routes (with general rate limiting)
app.get('/api/admin/customers', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.getCustomers);
app.get('/api/admin/customers/:id', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.getCustomer);
app.post('/api/admin/customers/:id/verify', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.verifyCustomer);
app.post('/api/admin/customers/:id/reject', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.rejectCustomer);
app.get('/api/admin/transactions', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.getTransactions);
app.get('/api/admin/dashboard/stats', generalRateLimiter.middleware, authenticateToken, requireAdmin, adminController.getDashboardStats);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SMS Admin Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Admin login: admin@example.com / admin123`);
});

export default app;


