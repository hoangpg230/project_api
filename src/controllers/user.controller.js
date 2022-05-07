const createError = require('http-errors')
const { PaginationParameters } = require('mongoose-paginate-v2')
const User = require('../models/user.model')
const userValidation = require('../validations/user.validation')

const pagination = async (req, res, next) => {
  try {
    const users = await User.paginate(...new PaginationParameters(req).get())
    res.json({
      status: 200,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  if (!req.query.id) {
    return getAll(req, res, next)
  }
  getById(req, res, next)
}

const getAll = async (req, res, next) => {
  try {
    const users = await User.find({}).lean()
    users.forEach((e) => delete e.password)
    res.json({
      status: 200,
      data: users || null,
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const id = req.query.id
    const user = await User.findById(id).lean()
    delete user.password
    res.json({
      status: 200,
      data: user || null,
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const id = req.query.id
    if (!id) throw createError.BadRequest()
    const result = await userValidation.update.validateAsync(req.body)

    await User.findByIdAndUpdate(id, result)
    const user = await User.findById(id)
    res.json({
      status: 200,
      data: user,
    })
  } catch (error) {
    if (error.isJoi === true) return next(createError.BadRequest())
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const id = req.query.id
    if (!id) throw createError.BadRequest()
    const result = await User.deleteOne({ id })
    res.json({
      status: 200,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  pagination,
  get,
  update,
  destroy,
}
