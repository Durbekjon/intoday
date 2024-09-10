import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  createSheet,
  // getSheetsByWorkspace,
  getAllSheets,
  updateSheetById,
  deleteSheetById,
} from '../controllers/sheet.js'
import { author, role } from '../config/const.config.js'
import { permission } from '../middleware/permission.js'

const router = express.Router()

router.post('/', auth(author), createSheet)
router.get('/', auth(role), permission('read'), getAllSheets)
// router.get('/:wsid', auth(author), getSheetsByWorkspace)
router.put('/:id', auth(author), updateSheetById)
router.delete('/:id', auth(author), deleteSheetById)

export default router
