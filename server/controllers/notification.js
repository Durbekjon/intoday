import { createError } from '../utils/error.js'
import { setCache, getCache, deleteCache } from '../services/caching.js'
import { Notification } from '../models/Schema.js'

export const get = async (req, res, next) => {
  try {
    const key = `notification/user-${req.user._id}`

    const cache = await getCache(key)

    if (cache) {
      return res.status(200).json(cache)
    }

    const notifications = await Notification.find({
      to: req.user._id,
    }).populate('member')

    await setCache(key, notifications)

    return res.status(200).json(notifications)
  } catch (error) {
    return next(createError(500, error))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const data = await Notification.findById(id)

    if (!data) {
      return next(createError(404, 'Not found'))
    }

    data.isRead = true
    await data.save()

    return res.status(200).json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
