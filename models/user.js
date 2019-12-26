const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (_, user) => {
    user.id = user._id.toString()
    delete user._id
    delete user.__v
    delete user.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)