const Joi = require('joi')

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const register = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  avatar: Joi.string(),
  address: Joi.string(),
  phoneNumber: Joi.string().pattern(
    new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
  ),
})

module.exports = {
  login,
  register,
}
