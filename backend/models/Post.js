const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 200,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array, // userIdが格納されていく
      default: [],
    },
  },

  { timestamps: true },
)

module.exports = mongoose.model('Post', PostSchema)
