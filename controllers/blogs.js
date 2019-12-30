const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})
  
blogsRouter.post('/', async (req, res, next) => {
  const user = await User.findOne()
  const blog = new Blog({
    ...req.body,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch(e) {
    next(e)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedBlog)
  } catch(e) {
    next(e)
  }
})

module.exports = blogsRouter