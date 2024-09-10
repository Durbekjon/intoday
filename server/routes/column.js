import express from 'express'
import { auth } from '../middleware/auth.js'
import { create, update, deleteOne, getBySheet } from '../controllers/column.js'

import { author } from '../config/const.config.js'

const router = express.Router()

router.post('/', auth(author), create)

router.get('/:shid', auth(author), getBySheet)

router.put('/:id', auth(author), update)

router.delete('/:id', auth(author), deleteOne)

export default router
