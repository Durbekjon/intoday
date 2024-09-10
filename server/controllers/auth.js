import { User } from '../models/Schema.js'
import { signUser } from './jwt.js'
import bcrypt from 'bcrypt'
import { deleteCache } from '../services/caching.js'
import { SALT_ROUNDS } from '../config/const.config.js'
import { createError } from '../utils/error.js'
import HTTP_MESSAGES from '../config/http.js'

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(createError(400, HTTP_MESSAGES.MISSING_REQUIRED_FIELDS))
    }

    const existUser = await User.findOne({ email })
    if (existUser) {
      return next(createError(400, HTTP_MESSAGES.USER_EXIST))
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const newUser = new User({
      email,
      password: hashedPassword,
    })
    await newUser.save()

    const token = await signUser(newUser.id)

    const data = newUser.toObject()
    delete data.password

    // Ensure cache is cleared in case user data was cached
    deleteCache('user/' + String(newUser._id))

    return res.status(201).json({ data, token })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(createError(400, HTTP_MESSAGES.MISSING_REQUIRED_FIELDS))
    }

    const population = [
      {
        path: 'roles',
        populate: { path: 'company', select: 'name' },
        select: '-user',
      },
      {
        path: 'notifications',
      },
    ]

    const user = await User.findOne({ email })
      .populate(population)
      .select('-__v')
    if (!user) {
      return next(createError(404, HTTP_MESSAGES.NOT_FOUND))
    }

    const passwordMatches = bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return next(createError(401, HTTP_MESSAGES.INCORRECT_PASSWORD))
    }

    const token = await signUser(user.id)

    const data = user.toObject()
    delete data.password

    // Cache deletion after login to avoid stale data
    deleteCache('user/' + String(user._id))

    return res.status(200).json({ data, token })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const u = req.user
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(u.id)
    if (!user) {
      return next(createError(404, HTTP_MESSAGES.NOT_FOUND))
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password)
    if (!checkPassword) {
      return next(createError(401, HTTP_MESSAGES.INCORRECT_PASSWORD))
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedNewPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedNewPassword
    await user.save()

    // Clear the cache after updating the password
    deleteCache('user/' + String(user._id))

    return res.status(200).json({ message: HTTP_MESSAGES.PASSWORD_UPDATED })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const changeRole = async (req, res, next) => {
  try {
    const u = req.user
    const r = req.params.id

    const user = await User.findById(u.id)
    if (!user || !user.roles.includes(r)) {
      return next(createError(404, HTTP_MESSAGES.NOT_FOUND))
    }

    user.selectedRole = r
    await user.save()

    deleteCache('user/' + String(user._id))

    return res.status(200).json({ result: 'OK' })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const u = req.user
    const { name, surname, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      u.id,
      {
        name,
        surname,
        avatar,
      },
      { new: true }
    ).select('-password -__v -roles')

    if (!user) {
      return next(createError(404, HTTP_MESSAGES.NOT_FOUND))
    }

    deleteCache('user/' + String(user._id))

    return res.status(200).json(user)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const get = async (req, res, next) => {
  try {
    let u = req.user

    return res.status(200).json(u)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const findByIdEmail = async (req, res, next) => {
  try {
    const email = req.params.email

    const d = await User.findOne({ email })
      .select('name surname email avatar')
      .populate({ path: 'avatar' })

    return res.status(200).json(d)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
