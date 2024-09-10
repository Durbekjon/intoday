import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  create,
  deleteCompany,
  getOne,
  update,
} from '../controllers/company.js'
import { author } from '../config/const.config.js'
const router = express.Router()

router.post('/', auth(false), create)

router.get('/:id', auth(author), getOne)

router.put('/:id', auth(author), update)

router.delete('/:id', auth(author), deleteCompany)

export default router
