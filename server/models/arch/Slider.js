import { Types, Schema, model } from "mongoose";

const sliderSchema = new Schema({
  image: {
    type: Types.ObjectId,
    ref: "File",
  },

  translations: {
    ru: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
    uz: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
    eng: {
      title: String,
      description: String,
      additional_text: String,
      shortDescription: String,
    },
  },
  
  link: String,
  type: {
    type: String,
    enum: ["custom", "product", "service", "news"],
    default: "custom",
  },
  product: {
    type: Types.ObjectId,
    ref: "Product",
  },
  service: {
    type: Types.ObjectId,
    ref: "Service",
  },
  news: {
    type: Types.ObjectId,
    ref: "News",
  },
});
const Slider = model("Slider", sliderSchema);
export default Slider;
