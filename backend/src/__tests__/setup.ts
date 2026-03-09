// Jest setup file
// Add any global test configurations here

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-do-not-use-in-production';
process.env.MONGODB_URI = 'mongodb://localhost/test_db';

// Mock console methods if needed
// jest.spyOn(console, 'log').mockImplementation(() => {});
// jest.spyOn(console, 'error').mockImplementation(() => {});
