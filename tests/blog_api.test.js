const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const { blogs } = require('./dummyBlogs')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = blogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are retuned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(blogs.length)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs should have field id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('a blog can be added', async () => {
  const newBlog = {
    title: "Test Title",
    author: "Test Author",
    url: "https://testing.com/",
    likes: 999
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const newBlogs = await api.get('/api/blogs')

  expect(newBlogs.body.length).toBe(blogs.length + 1)

  const titles = newBlogs.body.map(b => b.title)
  expect(titles).toContain('Test Title')
})

test('adding a blog without likes sets value to zero', async () => {
  const newBlog = {
    title: "Test Title 2",
    author: "Test Author",
    url: "https://testing.com/",
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  expect(result.body.likes).toBe(0)
})

test('unable to add blog without title and url', async () => {
  const newBlog = {
    author: "Test Author"
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog deletion works', async () => {
  const result = await api
    .delete('/api/blogs/5a422a851b54a676234d17f7')
    .expect(204)

    const newBlogs = await api.get('/api/blogs')

    expect(newBlogs.body.length).toBe(blogs.length - 1)
  
    const titles = newBlogs.body.map(b => b.title)
    expect(titles).not.toContain('React patterns')
})

afterAll(() => {
  mongoose.connection.close()
})