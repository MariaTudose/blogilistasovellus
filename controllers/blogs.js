const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response, next) => {
  const blog = request.body

  const newBlog = new Blog({
    ...blog,
    likes: blog.likes === undefined ? 0 : blog.likes,
  })

  try { 
    const savedBlog = await newBlog.save()
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter