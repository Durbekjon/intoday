import { Plan } from '../models/Schema.js'
import { deleteCache, getCache, setCache } from '../services/caching.js'
import { createError } from '../utils/error.js'
export const createPlan = async (req, res, next) => {
  try {
    await new Plan(req.body).save()
    await deleteCache('plans')
    return res.status(201).json({ message: 'Plan was successfully created' })
  } catch (error) {
    return next(createError(500, error))
  }
}

export const getPlans = async (req, res, next) => {
  try {
    let caches = await getCache('plans')
    if (!caches) {
      caches = await Plan.find().sort({ order: 1 }).select('-__v')
    }

    setCache('plans', caches)
    return res.status(200).json(caches)
  } catch (error) {
    return next(createError(500, error))
  }
}

export const updatePlanById = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id)
    if (!plan) return res.status(404).json({ message: 'Plan is not found' })

    await Plan.findByIdAndUpdate(req.params.id, req.body)
    deleteCache('plans')

    return res.status(200).json({ message: 'Plan was successfully updated' })
  } catch (error) {
    return next(createError(500, error))
  }
}

export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id)
    if (!plan) return res.status(404).json({ message: 'Plan is not found' })
    deleteCache('plans')

    return res.status(200).json({ message: 'Plan was deleted' })
  } catch (error) {
    return next(createError(500, error))
  }
}
