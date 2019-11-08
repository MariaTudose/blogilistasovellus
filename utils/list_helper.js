var _ = require('lodash')

const dummy = () => 1

const totalLikes = blogs => (
  blogs.map(blog => blog.likes).reduce((a,b) => a + b, 0)
)

const favoriteBlog = blogs => (
  blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, 0)
)

const mostBlogs = blogs => {
  const grouped = _.countBy(blogs, blog => blog.author)
  const author = Object.keys(grouped).reduce((a, b) => grouped[a] > grouped[b] ? a : b);

  return { author, blogs: grouped[author]}
}

const mostLikes = blogs => {
  const grouped = _.groupBy(blogs, blog => blog.author)
  const likes = []
  for(author in grouped) {
    likes.push({ author, likes: grouped[author].reduce((a,b) => a + b.likes, 0)})
  }
  return likes.reduce((a, b) => a.likes > b.likes ? a : b);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}