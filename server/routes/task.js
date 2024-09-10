import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { permission } from '../middleware/permission.js'
import { createTask, updateTask, deleteTask } from '../controllers/task.js'

import { role } from '../config/const.config.js'
const router = Router()

router.post('/', auth(role), permission('create'), createTask)
router.put('/:id', auth(role), permission('update'), updateTask)
router.delete('/:id', auth(role), permission('delete'), deleteTask)

export default router
