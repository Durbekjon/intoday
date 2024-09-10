import mongoose, { Types } from 'mongoose'

const Schema = mongoose.Schema

const fileSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  
  },
  for: {
    type: String,
    enum: [
      'banner',
      'news',
      'partner',
      'portfolio',
      'product',
      'service',
      'slider',
      'noactive',
    ],
  },
  banner: {
    type: Types.ObjectId,
    ref: 'Banner',
  },
  news: {
    type: Types.ObjectId,
    ref: 'News',
  },
  partner: {
    type: Types.ObjectId,
    ref: 'Partner',
  },
  portfolio: {
    type: Types.ObjectId,
    ref: 'Portfolio',
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
  },
  service: {
    type: Types.ObjectId,
    ref: 'Service',
  },
  slider: {
    type: Types.ObjectId,
    ref: 'Slider',
  },
})

const File = mongoose.model('File', fileSchema)
export default File
