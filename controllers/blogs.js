const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (_, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

const getTokenFrom = req => {
  const auth = req.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}
  
blogsRouter.post('/', async (req, res, next) => {
  const token = getTokenFrom(req)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] })
    if(!token || !decodedToken.id) {
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