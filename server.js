require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./db/connect');
const passport = require('./config/passport');
const swaggerSpec = require('./swagger');
const titlesRoutes = require('./routes/titles');
const genresRoutes = require('./routes/genres');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = Boolean(process.env.RENDER_EXTERNAL_URL);

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/auth', authRoutes);
app.use('/titles', titlesRoutes);
app.use('/genres', genresRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Movie/Show Watchlist API',
    docs: '/api-docs',
    login: '/auth/github',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
