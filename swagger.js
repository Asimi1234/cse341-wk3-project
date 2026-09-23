const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie/Show Watchlist API',
      version: '1.0.0',
      description:
        'A REST API for managing a personal movie and show watchlist. ' +
        'Part 1 of 2 (CRUD only — authentication comes in Part 2).',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local development server' },
    ],
    components: {
      schemas: {
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
            error: { type: 'string', example: 'Title not found' },
          },
        },
      },
    },
  },
  // Files to scan for @swagger JSDoc annotations
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
