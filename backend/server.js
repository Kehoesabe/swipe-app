/**
 * Express Server
 * 
 * Main server entry point for the Swipe Type backend API.
 * 
 * Version: 1.0
 * Date: January 10, 2025
 * Status: MVP Implementation
 */

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Swipe Type Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (NODE_ENV === 'development') {
    console.log(`📝 Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`💳 Payment API: http://localhost:${PORT}/api/payment`);
    console.log(`🔔 Webhook API: http://localhost:${PORT}/api/webhook`);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});



