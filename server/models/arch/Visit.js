import { Schema, model } from "mongoose";

const visit = new Schema({
  count: { type: Number },
  date: { type: Date },
  visits: [{ type: Date }],
});
const Visit = model("Visit", visit);
export default Visit;
