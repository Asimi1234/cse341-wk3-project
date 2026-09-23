const mongoose = require('mongoose');
const Genre = require('../models/Genre');

/**
 * Maps a thrown error to an appropriate HTTP status code and message.
 */
const handleError = (res, err) => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  // Duplicate key error from the unique index on `name`
  if (err.code === 11000) {
    return res.status(400).json({ error: 'A genre with that name already exists' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

// GET /genres — get all genres
const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.status(200).json(genres);
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /genres/:id — get a single genre
const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    return res.status(200).json(genre);
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /genres — create a new genre
const createGenre = async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    return res.status(201).json(genre);
  } catch (err) {
    return handleError(res, err);
  }
};

// PUT /genres/:id — update an existing genre
const updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // apply schema validation on update
    });
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    return res.status(200).json(genre);
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /genres/:id — delete a genre
const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    return res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
