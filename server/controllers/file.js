import File from '../models/File.js'
import { bucket } from '../config/const.config.js'
import s3 from '../utils/aws-s3.js'

export default class FileController {
  async DeleteMany(ids) {
    try {
      for (const id of ids) {
        const file = await File.findById(id)

        const params = {
          Bucket: bucket,
          Key: file.key,
        }

        await File.findByIdAndDelete(id)
        s3.deleteObject(params, (err, data) => {
          if (err) {
            return true
          }
        })
      }
    } catch (error) {
      return false
    }
  }
}
