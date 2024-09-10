import { createError } from '../utils/error.js'

export const permission = (permission) => {
  return async (req, res, next) => {
    try {
      const role = req.role

      if (role.type === 'author') return next()

      if (!role.access.permissions.includes(permission)) {
        return next(createError(403, 'Access denied'))
      }

      next()
    } catch (error) {
      console.log(error)
      return next(createError(500, error.message || 'Internal Server Error'))
    }
  }
}
