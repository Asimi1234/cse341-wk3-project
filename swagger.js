const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie/Show Watchlist API',
      version: '1.0.0',
      description:
        'A REST API for managing a personal movie and show watchlist. ' +
        'Write operations (POST, PUT, DELETE) require a logged-in session via GitHub OAuth. ' +
        'Because auth is session/cookie based, protected routes must be tested in a browser ' +
        'after logging in at /auth/github — the Swagger "Try it out" button cannot hold the ' +
        'login session, so protected calls will return 401 there. Read operations (GET) are public.',
    },
    servers: [
      ...(process.env.RENDER_EXTERNAL_URL
        ? [{ url: process.env.RENDER_EXTERNAL_URL, description: 'Render production server' }]
        : []),
      { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Local development server' },
    ],
    components: {
      securitySchemes: {
        githubSession: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description:
            'Session cookie set after logging in via GitHub OAuth at /auth/github. ' +
            'Established in the browser, not through Swagger UI.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB id', readOnly: true },
            githubId: { type: 'string', example: '1234567' },
            username: { type: 'string', example: 'octocat' },
            email: { type: 'string', example: 'octocat@github.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Title: {
          type: 'object',
          required: ['title', 'type', 'releaseYear', 'status', 'genreId'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB id', readOnly: true },
            title: { type: 'string', example: 'Inception' },
            type: { type: 'string', enum: ['movie', 'show'], example: 'movie' },
            releaseYear: { type: 'integer', example: 2010 },
            runtime: { type: 'integer', description: 'Runtime in minutes', example: 148 },
            status: {
              type: 'string',
              enum: ['watchlist', 'watching', 'finished'],
              example: 'finished',
            },
            rating: { type: 'integer', minimum: 1, maximum: 10, example: 9 },
            dateWatched: { type: 'string', format: 'date', example: '2026-01-15' },
            genreId: {
              type: 'string',
              description: 'ObjectId referencing a genre',
              example: '65a1f2c3d4e5f6a7b8c9d0e1',
            },
          },
        },
        Genre: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB id', readOnly: true },
            name: { type: 'string', example: 'Science Fiction' },
            description: {
              type: 'string',
              example: 'Films and shows set in speculative, futuristic, or scientific worlds',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Resource not found' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
