import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { cancel, get, invite, statusInvite } from '../controllers/member.js'
import { author } from '../config/const.config.js'

const router = Router()

router.post('/', auth(author), invite)
router.put('/cancel/:id', auth(author), cancel)
router.put('/status', auth(false), statusInvite)
router.put('/:id', auth(author))
router.get('/', auth(author), get)
export default router
