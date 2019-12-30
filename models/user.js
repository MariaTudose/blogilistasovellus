const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    unique: true,
    required: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (_, user) => {
    user.id = user._id.toString()
    delete user._id
    delete user.__v
    delete user.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)