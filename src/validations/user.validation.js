const Joi = require('Joi')

const update = Joi.object({
  name: Joi.string(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  avatar: Joi.string(),
  address: Joi.string(),
  phoneNumber: Joi.string().pattern(
    new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
  ),
})

module.exports = {
    update
}
