import { createError } from '../utils/error.js'
import { Column, Sheet, Task } from '../models/Schema.js'
import HTTP_MESSAGES from '../config/http.js'
import { deleteCache, flush, getCache, setCache } from '../services/caching.js'

export const create = async (req, res, next) => {
  try {
    const { name, key, show, type, sheet, selects } = req.body

    const sheetData = await Sheet.findById(sheet).populate('columns')

    if (!sheetData) {
      return res.status(404).json({ message: 'Sheet not found' })
    }

    let keyExists = sheetData.columns.some((column) => column.key === key)

    let newKey = key
    if (keyExists) {
      let i = 1
      while (keyExists) {
        newKey = `${key}_${i}`
        keyExists = sheetData.columns.some((column) => column.key === newKey)
        i++
      }
    }

    const newData = new Column({
      name,
      key: newKey,
      show,
      type,
      sheet,
      selects,
      company: req.company,
    })

    await newData.save()

    await Sheet.findByIdAndUpdate(sheet, { $push: { columns: newData._id } })

    const fieldMapping = {
      text: ['text1', 'text2', 'text3', 'text4', 'text5'],
      number: ['number1', 'number2', 'number3', 'number4', 'number5'],
      checkbox: [
        'checkbox1',
        'checkbox2',
        'checkbox3',
        'checkbox4',
        'checkbox5',
      ],
      select: ['select1', 'select2', 'select3', 'select4', 'select5'],
      date: ['date1', 'date2', 'date3', 'date4', 'date5'],
    }

    const fieldsToCheck = fieldMapping[type] || []

    if (fieldsToCheck.length > 0) {
      const tasks = await Task.find({ sheet })

      // Track the field to be updated for all tasks
      let fieldToUpdate = null

      for (let task of tasks) {
        // Find the first task with an empty field
        for (let field of fieldsToCheck) {
          if (!task[field]) {
            fieldToUpdate = field
            break
          }
        }
        // Break the outer loop once an empty field is found
        if (fieldToUpdate) break
      }

      // If a field to update was found, update all tasks with the newKey
      if (fieldToUpdate) {
        await Task.updateMany(
          { sheet, [fieldToUpdate]: { $eq: null } }, // Only update tasks where the field is still empty
          { $set: { [fieldToUpdate]: newKey } }
        )
      }
    }

    await flush()

    return res.status(200).json(newData)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const getBySheet = async (req, res, next) => {
  try {
    const shid = req.params.shid
    const key = 'column/sheet-' + shid
    const cache = await getCache(key)

    if (cache) return res.status(200).json(cache)

    const datas = await Column.find({ company: req.company, sheet: shid })
    setCache(key, datas)
    return res.status(200).json(datas)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
export const update = async (req, res, next) => {
  try {
    const id = req.params.id

    const { name, key, show, type, selects } = req.body

    const column = await Column.findById(id)

    if (String(column.company) != req.company) {
      return next(createError(403, HTTP_MESSAGES.ACCESS_DENIED))
    }

    const data = await Column.findByIdAndUpdate(
      id,
      { name, key, show, type, selects },
      { new: true }
    )
    await flush()

    return res.status(200).json(data)
  } catch (error) {
    return next(createError(500, error))
  }
}
export const deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const column = await Column.findById(id)

    if (!column) return next(createError(404, HTTP_MESSAGES.NOT_FOUND))

    if (String(column.company) != req.company)
      return next(createError(403, HTTP_MESSAGES.ACCESS_DENIED))

    await Sheet.findByIdAndUpdate(column.sheet, { $pull: { columns: id } })

    await Column.findByIdAndDelete(id)
    await flush()

    return res
      .status(200)
      .json({ status: 'OK', result: HTTP_MESSAGES.DATA_DELETED })
  } catch (error) {
    return next(createError(500, error))
  }
}
