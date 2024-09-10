import { Sheet, Task, Log } from '../models/Schema.js' // Import Task model
import { createError } from '../utils/error.js'
import { setCache, getCache, deleteCache, flush } from '../services/caching.js'
import HTTP_MESSAGES from '../config/http.js'

export const createTask = async (req, res, next) => {
  try {
    const {
      name,
      status,
      files,
      members,
      priority,
      link,
      price,
      paid,
      sheet,
      logs,
      workspace,
    } = req.body

    const task = new Task({
      name,
      status,
      files,
      members,
      priority,
      link,
      price,
      paid,
      sheet,
      logs,
      workspace,
    })

    await task.save()
    await Sheet.findByIdAndUpdate(sheet, {
      $push: { tasks: task._id },
    })
    // Clear relevant cache after creation

    await flush()
    const log = new Log({
      user: req.user._id,
      task: task._id,
      type: 'task',
      data: task,
      action: 'created task',
      company: req.company,
    })

    await log.save()

    return res.status(201).json({
      status: 'OK',
      result: task,
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id
    const { name, status, files, members, priority, link, price, paid, sheet } =
      req.body

    let task = await Task.findById(id)

    if (!task) {
      return next(createError(404, HTTP_MESSAGES.NOT_FOUND))
    }

    task = await Task.findByIdAndUpdate(
      id,
      {
        name,
        status,
        files,
        members,
        priority,
        link,
        price,
        paid,
        sheet,
      },
      { new: true }
    )

    const log = new Log({
      user: req.user._id,
      task: task._id,
      type: 'task',
      data: task,
      action: 'updated task',
      company: req.company,
    })

    await log.save()
    await flush()

    return res.status(200).json(task)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id

    const task = await Task.findById(id)

    if (!task) return next(createError(404, HTTP_MESSAGES.NOT_FOUND))

    await Task.findByIdAndDelete(id)

    const log = new Log({
      user: req.user._id,
      task: task._id,
      type: 'task',
      action: 'deleted task',
      company: req.company,
    })

    await log.save()
    await flush()

    return res.status(200).json({
      status: 'OK',
      result: HTTP_MESSAGES.DATA_DELETED,
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
