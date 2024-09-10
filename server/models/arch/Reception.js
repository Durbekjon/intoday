import { Schema, Types, model } from 'mongoose'

const receptionSchema = new Schema({
  name: String,
  phone_number: String,
  description: String,
  type: {
    type: String,
    enum: ['question', 'product', 'service'],
    default: 'question',
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product',
  },
  service: {
    type: Types.ObjectId,
    ref: 'Service',
  },
})

const Reception = model('Reception', receptionSchema)
export default Reception
