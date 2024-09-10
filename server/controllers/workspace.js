import HTTP_MESSAGES from '../config/http.js'
import { checkPlan } from '../middleware/plan.js'
import { Workspace, Company, Log, Sheet, Task } from '../models/Schema.js'
import { setCache, getCache, deleteCache, flush } from '../services/caching.js'
import { GetWorkspaceById } from '../services/getServices.js'
import { createError } from '../utils/error.js'

export const createWorkspace = async (req, res, next) => {
  try {
    const company = req.company

    const plan = await checkPlan('workspace', company)
    if (plan) {
      return res
        .status(400)
        .json({ message: 'You have reached the limit of your chosen plan!' })
    }
    const workspace = await new Workspace({
      name: req.body.name,
      company,
    }).save()

    await Company.updateOne(
      { _id: company },
      { $push: { workspaces: workspace._id } }
    )

    const log = new Log({
      user: req.user._id,
      company,
      workspace: workspace._id,
      action: 'created workspace',
      type: 'workspace',
      data: workspace,
    })
    await log.save()

    await flush()
    return res.status(201).send(workspace)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getWorkspaces = async (req, res, next) => {
  try {
    const { company, user, role } = req

    const key = `${user._id}/workspaces/${company}`

    const cachedValue = getCache(key)
    if (cachedValue) {
      return res.status(200).send(cachedValue)
    } else {
      const search = { company }
      if (role.access) {
        if (role.access.view === 'own') {
          console.log(role.access.workspaces)
          search._id = { $in: role.access.workspaces }
        }
      }
      const workspaces = await Workspace.find(search)
        .sort({ order: 1 })
        .select('-__v')

      setCache(key, workspaces)
      return res.status(200).send(workspaces)
    }
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const getOneWorkspace = async (req, res, next) => {
  try {
    const id = req.params.id
    const company = req.company
    const workspace = await Workspace.findById(id).populate('sheets')

    const role = req.role

    if (
      (role.type !== 'author' &&
        role.access.type === 'own' &&
        !role.access.workspaces.includes(id)) ||
      String(workspace.company) !== company
    ) {
      return next(createError(403, HTTP_MESSAGES.ACCESS_DENIED))
    }

    console.log(role)

    return res.status(200).json(workspace)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const updateWorkspaceById = async (req, res, next) => {
  try {
    const { id } = req.params
    const workspace = await GetWorkspaceById(id)

    if (!workspace) {
      return next(createError(404, 'Workspace not found'))
    }

    const { name, sheets, order } = req.body

    const updateData = {}

    if (name) updateData.name = name
    if (sheets) updateData.sheets = sheets
    if (order) updateData.order = order

    const data = await Workspace.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    const log = new Log({
      user: req.user._id,
      company: req.company,
      workspace: id,
      action: 'updated workspace',
      type: 'workspace',
      data: data,
    })

    await log.save()
    await flush()
    return res.status(200).json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const deleteWorkspaceById = async (req, res, next) => {
  try {
    const id = req.params.id
    const company = req.company

    const workspace = await Workspace.findOne({
      company,
      _id: id,
    })

    if (!workspace) {
      return next(createError(404, 'Workspace not found'))
    }

    if (String(workspace.company) !== company) {
      return next(createError(403, "You don't have access"))
    }

    await Workspace.findByIdAndDelete(id)
    await Company.updateOne(
      { _id: company },
      { $pull: { workspaces: workspace._id } }
    )

    await Sheet.deleteMany({ workspace: id })
    await Task.deleteMany({ workspace: id })

    const log = new Log({
      user: req.user._id,
      company,
      workspace: id,
      action: 'deleted workspace',
      type: 'workspace',
    })
    await log.save()

    await flush()

    return res.status(200).send({ message: 'Workspace was deleted' })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
