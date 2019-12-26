const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: String,
  url: {type: String, required: true},
  likes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
  transform: (_, blog) => {
    blog.id = blog._id
    delete blog._id
    delete blog.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)