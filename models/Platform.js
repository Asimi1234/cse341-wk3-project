const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Platform name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    baseUrl: {
      type: String,
      trim: true,
    },
    subscriptionCost: {
      type: Number,
      min: [0, 'Subscription cost cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Platform', platformSchema);
