const mongoose = require('mongoose');
const Title = require('../models/Title');

const handleError = (res, err) => {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

const getAllTitles = async (req, res) => {
  try {
    const titles = await Title.find();
    return res.status(200).json(titles);
  } catch (err) {
    return handleError(res, err);
  }
};

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

const createTitle = async (req, res) => {
  try {
    const title = await Title.create(req.body);
    return res.status(201).json(title);
  } catch (err) {
    return handleError(res, err);
  }
};

const updateTitle = async (req, res) => {
  try {
    const title = await Title.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.status(200).json(title);
  } catch (err) {
    return handleError(res, err);
  }
};

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
