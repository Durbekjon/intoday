import multer from 'multer'
import multerS3 from 'multer-s3'
import s3 from '../utils/aws-s3.js' // Assuming aws-s3.js configures S3 client
import { bucket } from '../config/const.config.js' // Assuming bucket name is imported

const upload = (dir) => {
  return multer({
    storage: multerS3({
      s3,
      bucket,
      metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname })
      },
      key: function (req, file, cb) {
        cb(null, `${dir}/${Date.now()}.${file.mimetype.split('/')[1]}`)
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
  })
}

const uploadToFolder = async (req, res, next) => {
  const folder = req.params.folder

  try {
    if (req.files && req.files.length === 1) {
      await upload(folder).single('file')(req, res, next) // Use async/await for clarity
    } else {
      await upload(folder).array('file', 10)(req, res, next)
    }
  } catch (error) {
    console.error('Upload error:', error) // Log the error for debugging
    res.status(500).json({ message: 'Upload failed' }) // Send error response
  }
}

export default uploadToFolder
