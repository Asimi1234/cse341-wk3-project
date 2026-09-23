const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['movie', 'show'],
        message: 'Type must be either "movie" or "show"',
      },
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
    },
    runtime: {
      type: Number,
      min: [0, 'Runtime cannot be negative'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['watchlist', 'watching', 'finished'],
        message: 'Status must be one of: watchlist, watching, finished',
      },
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10'],
    },
    dateWatched: {
      type: Date,
    },
    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, 'genreId is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Title', titleSchema);
