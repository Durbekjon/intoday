import { Router } from 'express'
import Responser from '../../utils/responser.js'
import Visit from '../models/Visit.js'

const router = Router()
const responser = new Responser()
let data = null
router.post('/add', async (req, res) => {
  try {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()

    let startDate = new Date(year, month, 1)
    let endDate = new Date(year, month + 1, 1)

    const dbMonth = await Visit.findOne({
      date: { $gte: startDate, $lt: endDate },
    })

    if (!dbMonth) {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 1)
      await Visit.updateMany(
        {
          date: { $gte: startDate, $lt: startDate },
        },
        { $set: { visits: [] } }
      )

      const newMonth = new Visit({ count: 1, date, visits: [date] })
      await newMonth.save()
      data = null
      return responser.res(res, 201, newMonth)
    } else {
      dbMonth.count += 1
      dbMonth.visits.push(date)
      await dbMonth.save()
      data = null
      return responser.res(res, 200, dbMonth)
    }
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

router.get('/', async (req, res) => {
  try {
    if (data) {
      return responser.res(res, 200, data)
    }
    data = await Visit.find()

    return responser.res(res, 200, data)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

export default router
