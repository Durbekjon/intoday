import { Sheet, Workspace, Log, Task } from '../models/Schema.js'
import { setCache, getCache, deleteCache, flush } from '../services/caching.js'
import { GetSheetById } from '../services/getServices.js'
import { createError } from '../utils/error.js'
import { checkPlan } from '../middleware/plan.js'
import mongoose from 'mongoose'

// CREATE SHEET
export const createSheet = async (req, res, next) => {
  try {
    const { workspace, name } = req.body
    const company = req.company

    // Check if the plan allows creating a new sheet
    const plan = await checkPlan('sheet', company)
    if (plan) {
      return res.status(400).json({
        message: 'You have reached the limit of your chosen plan!',
      })
    }

    // Create a new sheet
    const sheet = await new Sheet({
      name,
      workspace,
      company,
    }).save()

    // Update the workspace to include the new sheet
    const updated = await Workspace.findByIdAndUpdate(
      workspace,
      {
        $push: { sheets: sheet._id },
      },
      { new: true }
    )
    console.log(updated)

    // Log the action
    const log = new Log({
      user: req.user._id,
      sheet: sheet._id,
      type: 'sheet',
      data: sheet,
      company,
      action: 'created sheet',
    })
    await log.save()

    // Clear cache after creating a new sheet
    flush()

    return res.status(201).send(sheet)
  } catch (error) {
    console.log(error)
    return next(createError(500, error.message))
  }
}

// GET ALL SHEETS
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

    // Define the base query for finding workspaces
    const workspaceQuery = { company: new mongoose.Types.ObjectId(company) }

    // If the user has limited access (e.g., "own" view), apply the relevant workspace filters
    if (role?.access?.view === 'own') {
      workspaceQuery._id = {
        $in:
          role.access.workspaces.map(
            (workspace) => new mongoose.Types.ObjectId(workspace)
          ) || [],
      }
    }

    // Fetch workspaces with the relevant sheets, columns, and tasks populated
    const workspaces = await Workspace.find(workspaceQuery) // <-- Fixed missing workspaceQuery here
      .sort({ order: 1 }) // Sort the workspaces by order
      .populate({
        path: 'sheets',
        populate: [
          { path: 'columns', populate: { path: 'selects' } }, // Populate columns and their selects
          {
            path: 'tasks',
            populate: [
              { path: 'members', populate: { path: 'user' } }, // Populate task members and their user data
            ],
          },
        ],
      })

    if (role.type !== 'author') {
      const filteredWorkspaces = workspaces.map((workspace) => {
        workspace.sheets = workspace.sheets.filter((sheet) => {
          return (
            role === 'member' ||
            sheet.tasks.some((task) =>
              task.members.some(
                (member) => member.user && member.user._id.equals(user._id)
              )
            )
          )
        })
        return workspace
      })
      setCache(key, filteredWorkspaces)
      return res.status(200).json(filteredWorkspaces)
    }
    setCache(key, workspaces)

    return res.status(200).json(workspaces)
  } catch (error) {
    console.error(error)
    return next(createError(500, error.message))
  }
}

// UPDATE SHEET
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

    // Update the sheet name
    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    )

    // Log the update
    const log = new Log({
      user: req.user._id,
      sheet: sheet._id,
      type: 'sheet',
      data: updatedSheet,
      action: 'updated sheet',
      company,
    })
    await log.save()

    // Clear cache
    flush()

    return res.status(200).send(updatedSheet)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

// DELETE SHEET
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

    // Delete the sheet
    await Sheet.findByIdAndDelete(_id)

    // Remove the sheet from the workspace
    await Workspace.updateOne(
      { _id: sheet.workspace },
      { $pull: { sheets: _id } }
    )

    // Delete tasks associated with the sheet
    await Task.deleteMany({ sheet: _id })

    // Log the deletion
    const log = new Log({
      user: req.user._id,
      sheet: _id,
      type: 'sheet',
      action: 'deleted sheet',
      company,
    })
    await log.save()

    // Clear cache
    flush()

    return res.status(200).send({ message: 'Sheet was deleted' })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
