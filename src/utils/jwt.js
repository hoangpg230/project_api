const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { userId }
      const secret = process.env.ACCESS_TOKEN_SECRET
      const option = {
        expiresIn: '4h',
      }
      JWT.sign(payload, secret, option, (err, token) => {
        if (err) return reject(createError.InternalServerError)
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(createError.Unauthorized())
        }
        return next(createError.Unauthorized(err.message))
      }
      req.payload = payload
      next()
    })
  },
}
