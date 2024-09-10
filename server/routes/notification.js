import { Router } from 'express'
import { get, getOne } from '../controllers/notification.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.get('/', auth(false), get)
router.get('/:id', auth(false), getOne)

export default router
