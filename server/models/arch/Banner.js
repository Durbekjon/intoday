import { Types, model, Schema } from "mongoose";

const bannerSchema = new Schema({
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
  product: { type: Types.ObjectId, ref: "Product" },
  portfolio: { type: Types.ObjectId, ref: "Portfolio" },
  service: { type: Types.ObjectId, ref: "Service" },
  news: { type: Types.ObjectId, ref: "News" },
  link: { type: String },
  type: {
    type: String,
    enum: ["custom", "product", "service", "news", "portfolio"],
    default: "custom",
  },
});

const Banner = model("Banner", bannerSchema);
export default Banner;
