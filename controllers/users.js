const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_, res) => {
  const users = await User.find({})
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)
  } catch (e) {
    next(e)
  }
})

module.exports = usersRouter