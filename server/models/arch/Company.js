import mongoose from 'mongoose'

const Schema = mongoose.Schema

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo1_default: {
    type: mongoose.Types.ObjectId,
    ref: 'File',
  },
  logo1_mini: {
    type: mongoose.Types.ObjectId,
    ref: 'File',
  },
  logo2_default: {
    type: mongoose.Types.ObjectId,
    ref: 'File',
  },
  logo2_mini: {
    type: mongoose.Types.ObjectId,
    ref: 'File',
  },
  translations: {
    eng: {
      description: {
        type: String,
      },
      region: {
        type: String,
      },
      director: {
        type: String,
      },
      country: String,
      address: String,
      location: String,
    },
    ru: {
      description: {
        type: String,
      },
      region: {
        type: String,
      },
      director: {
        type: String,
      },
      country: String,
      address: String,
      location: String,
    },
    uz: {
      description: {
        type: String,
      },
      region: {
        type: String,
      },
      director: {
        type: String,
      },
      country: String,
      address: String,
      location: String,
    },
  },

  statistics: {
    dayclientscount: Number,
    monthclientscunt: Number,
    yearcount: Number,
    allcountbuyers: Number,
  },

  location: String,
  mail: String,
  phone1: String,
  phone2: String,
  phone3: String,
  showPrice: {
    type: Boolean,
    default: false,
  },
  social: [{ link: String, name: String }],
})

const Company = mongoose.model('Company', companySchema)
export default Company
