const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestaps: true }
);

module.exports = mongoose.model('Post', PostSchema);
