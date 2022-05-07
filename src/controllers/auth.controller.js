const createError = require('http-errors')
const User = require('../models/user.model')
const authValidation = require('../validations/auth.validation')
const { signAccessToken } = require('../utils/jwt')

const login = async (req, res, next) => {
  try {
    const result = await authValidation.login.validateAsync(req.body)

    const user = await User.findOne({ email: result.email })
    if (!user) throw createError.NotFound('User not register')

    const isMath = await user.isValidPassword(result.password)
    if (!isMath)
      throw createError.Unauthorized('Username/Password is not valid')

    const accessToken = await signAccessToken(user.id)

    res.send({
      accessToken,
    })
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('Invalid Username/Password'))
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const result = await authValidation.register.validateAsync(req.body)
    const doesExit = await User.findOne({ email: result.email })
    if (doesExit) {
      console.log(doesExit)
      throw createError.Conflict(`${result.email} is already been registered`)
    }
    const user = new User(result)
    const savedUser = await user.save()

    const accessToken = await signAccessToken(savedUser.id)
    res.send({
      accessToken,
    })
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

module.exports = {
  login,
  register,
}
