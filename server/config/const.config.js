import dotenv from 'dotenv'
dotenv.config()
const DB_URI = process.env.DB_URI
const PORT = process.env.PORT || 3000
const secret = process.env.SECRET || 'customsecret'
const SALT_ROUNDS = 10
const accessKeyId = process.env.S3_ACCESS_KEY_ID
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const region = process.env.S3_BUCKET_REGION
const bucket = process.env.S3_BUCKET_NAME
const role = ['author', 'member', 'viewer']
const author = ['author']

const S3_CONFIG = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
}

export { DB_URI, PORT, secret, S3_CONFIG, bucket, SALT_ROUNDS, role, author }
