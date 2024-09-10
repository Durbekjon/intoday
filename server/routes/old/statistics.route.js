import { Router } from 'express'
import Responser from '../../utils/responser.js'
import News from '../models/News.js'
import Slider from '../models/Slider.js'
import Partner from '../models/Partner.js'
import Service from '../models/Service.js'
import Product from '../models/Product.js'
import Portfolio from '../models/Portfolio.js'
import Reception from '../models/Reception.js'
import File from '../models/File.js'
const router = Router()
const responser = new Responser()

let statistics = null

router.get('/', async (req, res) => {
  try {
    const { refresh } = req.query
    if (!refresh && statistics) {
      return responser.res(res, 200, statistics)
    }
    const news = await News.countDocuments()
    const sliders = await Slider.countDocuments()
    const partners = await Partner.countDocuments()
    const services = await Service.countDocuments()
    const products = await Product.countDocuments()
    const portfolios = await Portfolio.countDocuments()
    const orders = await Reception.countDocuments()
    const totalFiles = await File.countDocuments()

    const filesSize = await FileSize()

    const serverTarif = {
      cpucore: 1, // count
      cpuGhz: 2.8, //ghz
      ram: 1, // gb
      disk: 15, // gb
      price: 60000,
      systemSize: 2.5, //gb
      appSize: 0.9, // gb
      filesSize,
    }

    statistics = {
      news,
      sliders,
      partners,
      services,
      products,
      portfolios,
      orders,
      totalFiles,
      serverTarif,
    }

    return responser.res(res, 200, statistics)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})
router.get('/photos', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const images = await File.find({ type: ['jpg', 'jpeg', 'png'] })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('banner news partner portfolio product service slider')

    const count = await File.countDocuments({ type: ['jpg', 'jpeg', 'png'] })
    const totalPages = Math.ceil(count / limit)

    const response = {
      photosList: images,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        count,
        pageSize: parseInt(limit),
      },
    }

    return responser.res(res, 200, response)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

const FileSize = async () => {
  try {
    const files = await File.find()

    let size = 0

    files.forEach((file) => {
      size += file.size
    })

    if (size >= 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB'
    }
  } catch (error) {}
}

export default router
