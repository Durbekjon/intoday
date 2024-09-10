import { Schema, Types, model } from 'mongoose'

const portfolioSchema = new Schema(
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
const Portfolio = model('Portfolio', portfolioSchema)

export default Portfolio
