import { Schema, Types, model } from 'mongoose'

const serviceSchema = new Schema(
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
    tags: [{ type: String }],
    maxPrice: {
      type: Number,
    },
    minPrice: {
      type: Number,
    },
    showPrice: {
      type: Boolean,
      default: false,
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
const Service = model('Service', serviceSchema)

export default Service
