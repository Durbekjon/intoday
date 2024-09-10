import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import {
  changePassword,
  changeRole,
  findByIdEmail,
  get,
  login,
  register,
  update,
} from '../controllers/auth.js'

const router = Router()

router.post('/register', register)

router.post('/login', login)

router.put('/change-password', auth(false), changePassword)
router.put('/role/:id', auth(false), changeRole)

router.put('/', auth(false), update)

router.get('/', auth(false), get)
router.get('/:email', auth(false), findByIdEmail)

export default router
