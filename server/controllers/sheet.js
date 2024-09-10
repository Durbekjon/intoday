import { Sheet, Workspace, Log, Task } from '../models/Schema.js'
import { setCache, getCache, deleteCache, flush } from '../services/caching.js'
import { GetSheetById } from '../services/getServices.js'
import { createError } from '../utils/error.js'
import { checkPlan } from '../middleware/plan.js'
import mongoose from 'mongoose'
export const createSheet = async (req, res, next) => {
  try {
    const { workspace, name } = req.body
    const company = req.company
    const plan = await checkPlan('sheet', company)
    if (plan) {
      return res
        .status(400)
        .json({ message: 'You have reached the limit of your chosen plan!' })
    }
    const sheet = await new Sheet({
      name,
      workspace,
      company,
    }).save()

    await Workspace.updateOne(
      { _id: workspace },
      { $push: { sheets: sheet._id } }
    )

    const log = new Log({
      user: req.user._id,
      sheet: sheet._id,
      type: 'sheet',
      data: sheet,
      company,

      action: 'created sheet',
    })

    await log.save()

    await flush()

    return res.status(201).send(sheet)
  } catch (error) {
    console.log(error)
    return next(createError(500, error.message))
  }
}

// export const getSheetsByWorkspace = async (req, res, next) => {
//   try {
//     const company = req.company
//     const key = 'sheets/wsid/' + req.params.wsid

//     const cachedValue = getCache(key)
//     if (cachedValue) {
//       return res.status(200).send(cachedValue)
//     } else {
//       const sheets = await Sheet.find({
//         workspace: req.params.wsid,
//         company,
//       })
//         .sort({ order: 1 })
//         .select('-__v')
//       setCache(key, sheets)
//       return res.status(200).send(sheets)
//     }
//   } catch (error) {
//     return next(createError(500, error.message))
//   }
// }
export const getAllSheets = async (req, res, next) => {
  try {
    const { company, user, role } = req

    if (!company || !user) {
      return next(createError(400, 'Company or User information missing.'))
    }

    const key = `${user._id}/sheets/${company}`
    const cachedValue = getCache(key)

    if (cachedValue) {
      console.log('Cache hit for key:', key)
      return res.status(200).json(cachedValue)
    }

    const matchWorkspaces = { company }

    if (role?.access?.view === 'own') {
      matchWorkspaces._id = { $in: role.access.workspaces || [] }
    }

    // Aggregation pipeline
    const workspaces = await Workspace.aggregate([
      { $match: matchWorkspaces },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'sheets',
          localField: 'sheets',
          foreignField: '_id',
          as: 'sheets',
        },
      },
      { $unwind: '$sheets' },
      {
        $lookup: {
          from: 'columns',
          localField: 'sheets.columns',
          foreignField: '_id',
          as: 'sheets.columns',
        },
      },
      { $unwind: '$sheets.columns' },
      {
        $lookup: {
          from: 'selects',
          localField: 'sheets.columns.selects',
          foreignField: '_id',
          as: 'sheets.columns.selects',
        },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'sheets.tasks',
          foreignField: '_id',
          as: 'sheets.tasks',
        },
      },
      { $unwind: '$sheets.tasks' },
      {
        $lookup: {
          from: 'members',
          localField: 'sheets.tasks.members',
          foreignField: '_id',
          as: 'sheets.tasks.members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sheets.tasks.members.user',
          foreignField: '_id',
          as: 'sheets.tasks.members.user',
        },
      },
      {
        $addFields: {
          'sheets.tasks.members.user': {
            $arrayElemAt: ['$sheets.tasks.members.user', 0],
          },
        },
      },
      {
        $match: {
          'sheets.tasks.members.user._id': role?.access?.id,
        },
      },
      {
        $group: {
          _id: '$_id',
          sheets: { $push: '$sheets' },
        },
      },
    ])

    setCache(key, workspaces)

    return res.status(200).json(workspaces)
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return next(createError(400, 'Invalid request data.'))
    }
    return next(createError(500, 'An error occurred while fetching sheets.'))
  }
}

export const updateSheetById = async (req, res, next) => {
  try {
    const { id } = req.params
    const company = req.company
    const { name } = req.body
    const sheet = await GetSheetById(id)

    if (!sheet) {
      return next(createError(404, 'Sheet not found'))
    }

    if (String(sheet.company) !== company) {
      return next(createError(403, "You don't have access"))
    }

    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      { name },
      {
        new: true,
      }
    )

    const log = new Log({
      user: req.user._id,
      sheet: sheet._id,
      type: 'sheet',
      data: updatedSheet,
      action: 'updated sheet',
      company,
    })

    await log.save()

    await flush()

    return res.status(200).send(updatedSheet)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const deleteSheetById = async (req, res, next) => {
  try {
    const _id = req.params.id
    const company = req.company
    const sheet = await Sheet.findOne({
      company,
      _id,
    })

    if (!sheet) {
      return next(createError(404, 'Sheet not found'))
    }

    if (String(sheet.company) !== company) {
      return next(createError(403, "You don't have access"))
    }

    await Sheet.findByIdAndDelete(_id)

    await Workspace.updateOne(
      { _id: sheet.workspace },
      { $pull: { sheets: _id } }
    )
    await Task.deleteMany({ sheet: _id })

    const log = new Log({
      user: req.user._id,
      sheet: _id,
      type: 'sheet',
      action: 'deleted sheet',
      company,
    })

    await log.save()

    await flush()

    return res.status(200).send({ message: 'Sheet was deleted' })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
