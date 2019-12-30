const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const { blogs } = require('./dummyBlogs')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
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
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)

    const newBlogs = await api.get('/api/blogs')

    expect(newBlogs.body.length).toBe(blogs.length - 1)

    const titles = newBlogs.body.map(b => b.title)
    expect(titles).not.toContain('React patterns')
  })

  test('update likes', async () => {
    const res = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send({likes: 999})
      .expect(200)
      
    expect(res.body.likes).toBe(999)
  })
})

describe('when there is initially one user in db, ', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'user', password: 'pass' })
    await user.save()
  })

  test('creation fails if username has been taken', async () => {
    const usersAtStart = await User.find({})

    const user = {
      username: 'user',
      name: 'user',
      password: 'pass'
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

test('creation fails if username is missing', async () => {
  const usersAtStart = await User.find({})

  const user = {
    name: 'user',
    password: 'pass'
  }

  const result = await api
    .post('/api/users')
    .send(user)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` is required')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

test('creation fails if password is missing', async () => {
  const usersAtStart = await User.find({})

  const user = {
    username: 'user',
    name: 'user',
  }

  const result = await api
    .post('/api/users')
    .send(user)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('Password should be longer')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})