const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  address: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)

module.exports = User
