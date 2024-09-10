import { Schema, Types, model } from "mongoose";

const newsSchema = new Schema(
  {
    image: {
      type: Types.ObjectId,
      ref: "File",
    },
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
    views: Number,
    banner: {
      type: Types.ObjectId,
      ref: "File",
    },
  },
  {
    timestamps: true,
  }
);
const News = model("News", newsSchema);

export default News;
