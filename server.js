require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./db/connect');
const swaggerSpec = require('./swagger');
const titlesRoutes = require('./routes/titles');
const genresRoutes = require('./routes/genres');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON request bodies into req.body

// --- API documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Raw OpenAPI/Swagger spec as JSON (the "swagger.json")
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Routes ---
app.use('/titles', titlesRoutes);
app.use('/genres', genresRoutes);

// Simple root route so hitting the base URL isn't a 404
app.get('/', (req, res) => {
  res.json({
    message: 'Movie/Show Watchlist API',
    docs: '/api-docs',
  });
});

// --- Catch-all for unknown routes ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Start server only after the database is connected ---
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); // exit with a failure code if we can't connect
  }
};

start();
