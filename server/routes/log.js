import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { get } from '../controllers/log.js'
const router = Router()
const role = ['author', 'member', 'viewer']

router.get('/', auth(role), get)

export default router
