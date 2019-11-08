const listHelper = require('../utils/list_helper')
const { blogs } = require('./dummyBlogs')

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    expect(result).toBe(7)
  })

  test('equals the sum of the likes for all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list returns 0', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual(0)
  })

  test('is the only blog even if it has no likes', () => {
    const result = listHelper.favoriteBlog([blogs[4]])
    expect(result._id).toBe("5a422ba71b54a676234d17fb")
  })

  test('is the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result._id).toBe("5a422b3a1b54a676234d17f9")
  })
})

describe('most blogs', () => {
  test('returns the single author when there is only one blog', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    const expected = {
      author: "Michael Chan",
      blogs: 1
    }
    expect(result).toEqual(expected)
  })

  test('returns owner of most blogs and their amount', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    }
    expect(result).toEqual(expected)
  })
})

describe('most likes', () => {
  test('of sigle blog is its likes', () => {
    const result = listHelper.mostLikes([blogs[0]])
    const expected = {
      author: "Michael Chan", 
      likes: 7
    }
    expect(result).toEqual(expected)
  })

  test('are calculated correctly from all likes of same author', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: "Edsger W. Dijkstra", 
      likes: 17
    }
    expect(result).toEqual(expected)
  })
})