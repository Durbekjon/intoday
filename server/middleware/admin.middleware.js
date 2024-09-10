import { verifyUser } from '../controllers/jwt.js'

const AdminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: Missing or invalid token',
        success: false,
      })
    }

    const verify = await verifyUser(token)

    if (!verify) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid token or Token expired',
        success: false,
      })
    }

    req.user = verify
    if (!req.user.isAdmin) {
      return res.status(401).json({
        message: 'You are not admin',
        success: false,
      })
    }
    next()
  } catch (error) {
    console.error('Error in authentication middleware:', error)
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

export default AdminMiddleware
