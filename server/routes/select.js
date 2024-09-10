import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { create, get, update, deleteOne } from '../controllers/select.js'
import { author } from '../config/const.config.js'
const router = Router()

router.post('/', auth(author), create)
router.get('/', auth(author), get)
router.put('/:id', auth(author), update)
router.delete('/:id', auth(author), deleteOne)

export default router
