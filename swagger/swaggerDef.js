module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Course Management Platform Backend API',
    version: '1.0.0',
    description: 'API documentation for the Course Management Platform Backend Service',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
}; 