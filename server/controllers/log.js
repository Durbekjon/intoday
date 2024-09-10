import { Log } from '../models/Schema.js'
import { createError } from '../utils/error.js'
import { setCache, getCache } from '../services/caching.js'

export const get = async (req, res, next) => {
  try {
    const company = req.company
    const { type } = req.query

    if (!['task', 'sheet', 'workspace', 'company'].includes(type)) {
      return next(createError(400, 'Invalid type parameter'))
    }

    const key = `logs/${type}/${company}`

    const cache = await getCache(key)
    if (cache) return res.status(200).json(cache)

    const searchQuery = { type: type }

    let logs = await Log.find(searchQuery)
      .populate({
        path: 'user',
        select: 'name surname email',
      })
      .populate({ path: 'sheet', model: 'Sheet' })
      .populate({ path: 'task', model: 'Task' })
      .select('-__v')

    logs = logs.reverse()

    setCache(key, logs)

    return res.status(200).json(logs)
  } catch (error) {
    return next(createError(500, `Error fetching logs: ${error.message}`))
  }
}
