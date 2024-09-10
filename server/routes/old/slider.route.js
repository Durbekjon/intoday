import express from 'express'
import Slider from '../models/Slider.js'
import Responser from '../../utils/responser.js'
import AuthMiddleware from '../../middleware/auth.middleware.js'
import FileController from '../../controllers/file.controller.js'

const responser = new Responser()
const router = express.Router()
const file = new FileController()
let slider = null
let globalQuery = null

// Create a new Slider
router.post('/', AuthMiddleware, async (req, res) => {
  try {
    const newSlider = new Slider(req.body)

    const savedSlider = await newSlider.save()
    slider = null
    globalQuery = null
    return responser.res(res, 201, savedSlider)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

// Read all Slider entries with optional pagination and search
router.get('/', async (req, res) => {
  try {
    if (!slider) {
      slider = await Slider.find()
        .populate({ path: 'image', select: 'location' })
        .populate({
          path: 'news',
          populate: [
            {
              path: 'image',
              select: 'location',
            },
          ],
        })
        .populate({
          path: 'product',
          populate: [
            {
              path: 'service',
            },
            {
              path: 'images',
              select: 'location',
            },
          ],
        })
        .populate({
          path: 'service',
          populate: [
            {
              path: 'images',
              select: 'location',
            },
          ],
        })
    }

    return responser.res(res, 200, slider)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

// Read a specific Slider entry by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id

    const slider = await Slider.findById(id)
      .populate('image')
      .populate({
        path: 'news',
        populate: [
          {
            path: 'image',
            select: 'location',
          },
        ],
      })
      .populate({
        path: 'product',
        populate: [
          {
            path: 'service',
          },
          {
            path: 'images',
            select: 'location',
          },
        ],
      })
      .populate({
        path: 'service',
        populate: [
          {
            path: 'images',
            select: 'location',
          },
        ],
      })

    if (!slider) {
      return responser.res(res, 404, false, 'Slider not found')
    }

    return responser.res(res, 200, slider)
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

// Update a Slider entry by ID
router.put('/:id', AuthMiddleware, async (req, res) => {
  try {
    const {
      image,
      translations,
      product,
      news,
      service,
      type,
      link,
      shortDescription,
    } = req.body

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      {
        image,
        translations,
        product,
        news,
        service,
        type,
        link,
        shortDescription,
      },
      { new: true }
    ).populate('image product news service')
    if (updatedSlider) {
      slider = null
      return responser.res(res, 200, updatedSlider)
    } else {
      return responser.res(res, 404, false, 'Slider not found')
    }
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

// Delete a Slider entry by ID
router.delete('/:id', AuthMiddleware, async (req, res) => {
  try {
    const deletedSlider = await Slider.findByIdAndDelete(req.params.id)
    if (!deletedSlider) {
      return responser.res(res, 404, false, 'Slider not found')
    }
    await file.DeleteMany(deletedSlider.image)

    slider = null
    return responser.res(res, 200, false, 'Slider deleted')
  } catch (error) {
    return responser.errorHandler(res, error)
  }
})

export default router
