import JWT from 'jsonwebtoken'
import { secret } from '../config/const.config.js'
import { setCache, getCache } from '../services/caching.js'
import { User } from '../models/Schema.js'
import { populate } from 'dotenv'

export const signUser = async (id, expiresIn = '8h', isAdmin) => {
  try {
    return JWT.sign(
      {
        id,
      },
      secret,
      {
        expiresIn,
      }
    )
  } catch (error) {
    throw new Error('Failed to sign JWT')
  }
}

export const verifyUser = async (token) => {
  try {
    const decoded = JWT.verify(token, secret) // Removed 'await' from JWT.verify since it is synchronous

    const userId = decoded.id
    const key = `user/${userId}`

    const cache = await getCache(key)
    if (!cache) {
      // Correcting the populate chaining for proper nested population
      const data = await User.findById(userId)
        .populate({
          path: 'roles',
          populate: [
            {
              path: 'company',
              select: 'name author',
            },
            {
              path: 'access',
              populate: {
                path: 'company',
              },
              select: '-__v',
            },
          ],
        })
        .select('-__v -password')

      setCache(key, data)
      return data
    }

    return cache
  } catch (error) {
    console.error('Error verifying user:', error)
    return false
  }
}
