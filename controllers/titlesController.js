const mongoose = require('mongoose');
const Title = require('../models/Title');

/**
 * Maps a thrown error to an appropriate HTTP status code and message.
 * Keeps every catch block consistent: { error: "message" }.
 */
const handleError = (res, err) => {
  // Invalid ObjectId format in the URL (e.g. /titles/abc)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  // Schema validation failed (missing required field, bad enum, out of range)
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  // Anything else is an unexpected server error
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

// GET /titles — get all titles
const getAllTitles = async (req, res) => {
  try {
    const titles = await Title.find();
    return res.status(200).json(titles);
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /titles/:id — get a single title
const getTitleById = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.status(200).json(title);
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /titles — create a new title
const createTitle = async (req, res) => {
  try {
    const title = await Title.create(req.body);
    return res.status(201).json(title);
  } catch (err) {
    return handleError(res, err);
  }
};

// PUT /titles/:id — update an existing title
const updateTitle = async (req, res) => {
  try {
    const title = await Title.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document instead of the original
      runValidators: true, // apply schema validation on update
    });
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.status(200).json(title);
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /titles/:id — delete a title
const deleteTitle = async (req, res) => {
  try {
    const title = await Title.findByIdAndDelete(req.params.id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.status(200).json({ message: 'Title deleted successfully' });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getAllTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
};
