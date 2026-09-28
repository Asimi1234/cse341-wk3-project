const mongoose = require('mongoose');
const Genre = require('../models/Genre');

const handleError = (res, err) => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  if (err.code === 11000) {
    return res.status(400).json({ error: 'A genre with that name already exists' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.status(200).json(genres);
  } catch (err) {
    return handleError(res, err);
  }
};

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

const createGenre = async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    return res.status(201).json(genre);
  } catch (err) {
    return handleError(res, err);
  }
};

const updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    return res.status(200).json(genre);
  } catch (err) {
    return handleError(res, err);
  }
};

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
