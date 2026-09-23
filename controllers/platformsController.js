const mongoose = require('mongoose');
const Platform = require('../models/Platform');

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
    return res.status(400).json({ error: 'A platform with that name already exists' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

// GET /platforms — get all platforms
const getAllPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    return res.status(200).json(platforms);
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /platforms/:id — get a single platform
const getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    return res.status(200).json(platform);
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /platforms — create a new platform
const createPlatform = async (req, res) => {
  try {
    const platform = await Platform.create(req.body);
    return res.status(201).json(platform);
  } catch (err) {
    return handleError(res, err);
  }
};

// PUT /platforms/:id — update an existing platform
const updatePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    return res.status(200).json(platform);
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /platforms/:id — delete a platform
const deletePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    return res.status(200).json({ message: 'Platform deleted successfully' });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getAllPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
};
