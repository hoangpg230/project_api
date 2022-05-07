const express = require('express')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/authentication')

const router = express.Router()

router.get('/search', authMiddleware, userController.pagination)
router.get('/', authMiddleware, userController.get)
router.put('/', authMiddleware, userController.update)
router.delete('/', authMiddleware, userController.destroy)

module.exports = router
