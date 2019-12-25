const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})
  
blogsRouter.post('/', async (req, res, next) => {
  const blog = new Blog(req.body)

  try {
    const savedBlog = await blog.save()
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