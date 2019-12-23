const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch(e) {
    next(e)
  }
})

module.exports = blogsRouter