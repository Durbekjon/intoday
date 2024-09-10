import { Schema, Types, model } from 'mongoose'

const productSchema = new Schema(
  {
    images: [
      {
        type: Types.ObjectId,
        ref: 'File',
      },
    ],
    translations: {
      eng: {
        name: String,
        description: String,
        shortDescription: String,
      },
      ru: {
        name: String,
        description: String,
        shortDescription: String,
      },
      uz: {
        name: String,
        description: String,
        shortDescription: String,
      },
    },
    price: Number,
    show_price: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Types.ObjectId,
      ref: 'Service',
    },
    banner: {
      type: Types.ObjectId,
      ref: 'File',
    },
  },
  {
    timestamps: true,
  }
)
const Product = model('Product', productSchema)

export default Product
