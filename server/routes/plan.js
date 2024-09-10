import express from 'express'
import admin from '../middleware/admin.middleware.js'
import {
  createPlan,
  getPlans,
  updatePlanById,
  deletePlan,
} from '../controllers/plan.js'

const router = express.Router()

router.post('/', admin, createPlan)

router.get('/', getPlans)

router.put('/:id', admin, updatePlanById)

router.delete('/:id', admin, deletePlan)

export default router
