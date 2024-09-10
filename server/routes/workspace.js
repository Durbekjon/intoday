import express from 'express'
import { auth } from '../middleware/auth.js'
import {
  createWorkspace,
  getWorkspaces,
  getOneWorkspace,
  updateWorkspaceById,
  deleteWorkspaceById,
} from '../controllers/workspace.js'
import { role, author } from '../config/const.config.js'
const router = express.Router()

router.post('/', auth(author), createWorkspace)
router.get('/:id', auth(author), getOneWorkspace)
router.get('/', auth(role), getWorkspaces)
router.put('/:id', auth(author), updateWorkspaceById)
router.delete('/:id', auth(author), deleteWorkspaceById)

export default router
