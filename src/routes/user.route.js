const express = require('express')
const authMiddleware = require('../middlewares/authentication')

const router = express.Router()

router.get('/', authMiddleware, (req, res) => res.send('user'))

module.exports = router
