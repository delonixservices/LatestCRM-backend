require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB configuration
 mongoURI: 'mongodb+srv://admin:tKPuRWiVHPH9xTdA@atlascluster.xw9oe1k.mongodb.net/newcrm?retryWrites=true&w=majority&appName=AtlasCluster' ,

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpire: process.env.JWT_EXPIRE || '24h',

  // Default admin user configuration
  defaultAdmin: {
    name: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    role: 'admin'
  },

  // Cors configuration
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
}; 