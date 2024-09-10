import { verifyUser } from '../controllers/jwt.js'
import { createError } from '../utils/error.js'

export const auth = (types) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) {
        return next(createError(401, 'Token is missing!'))
      }

      // Verify the token
      const verify = await verifyUser(token)

      if (!verify) {
        return next(createError(401, 'Invalid token!'))
      }

      const user = verify

      if (types === false) {
        req.user = user
        return next()
      }

      const selectedRole = user.roles.find((r) => r._id == user.selectedRole)

      if (!selectedRole) {
        return next(createError(400, 'Please select your role!'))
      }

      req.user = user
      req.role = selectedRole
      req.company = selectedRole.company._id.toString()
      if (!types) {
        return next()
      }

      if (types.includes(selectedRole.type)) {
        return next()
      }

      return next(createError(401, 'Access denied!'))
    } catch (error) {
      console.log(error)
      return next(createError(500, error.message || 'Internal Server Error'))
    }
  }
}
