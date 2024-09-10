import { Select } from '../models/Schema.js'
import { deleteCache, setCache, getCache } from '../services/caching.js'
import { createError } from '../utils/error.js'
import HTTP_MESSAGES from '../config/http.js'
export const create = async (req, res, next) => {
  try {
    const { value, color } = req.body
    const company = req.company

    const data = new Select({ value, color, company })

    await data.save()

    deleteCache('selects/company-' + company)
    return res.status(201).json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const get = async (req, res, next) => {
  try {
    const company = req.company

    const key = 'selects/company-' + company

    const cache = await getCache(key)

    if (cache) return res.status(200).json(cache)

    const datas = await Select.find({ company }).select('value color')

    setCache(key, datas)

    return res.status(200).json(datas)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const update = async (req, res, next) => {
  try {
    const id = req.params.id

    const data = await Select.findById(id)

    if (!data) return next(createError(404, HTTP_MESSAGES.NOT_FOUND))

    const condition = String(data.company) === req.company

    if (!condition) return next(createError(403, HTTP_MESSAGES.ACCESS_DENIED))

    const { value, color } = req.body

    if (value) data.value = value
    if (color) data.color = color

    await data.save()
    deleteCache('selects/company-' + req.company)

    return res.status(200).json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const data = await Select.findById(id)

    if (!data) return next(createError(404, HTTP_MESSAGES.NOT_FOUND))

    const condition = String(data.company) === req.company

    if (!condition) return next(createError(403, HTTP_MESSAGES.ACCESS_DENIED))

    await Select.findByIdAndDelete(id)
    deleteCache('selects/company-' + req.company)

    return res
      .status(200)
      .json({ status: 'OK', result: HTTP_MESSAGES.DATA_DELETED })
  } catch (error) {
    return next(createError(500, error.message))
  }
}
