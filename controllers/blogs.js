const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})
  
blogsRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token invalid or missing'})
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      ...req.body,
      user: user._id
    })

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
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token invalid or missing'})
    }

    const blog = await Blog.findById(req.params.id)

    if(blog.user.toString() === decodedToken.id.toString()) {
      blog.delete()
      return res.status(204).end()
    } else {
      return res.status(401).json({ error: 'only blog owner can delete blog'})
    }
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