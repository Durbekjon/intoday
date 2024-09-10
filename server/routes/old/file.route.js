import express from "express";
import uploadToFolder from "../../middleware/multer.js";
import File from "../models/File.js";
import Responser from "../../utils/responser.js";
import { bucket } from "../../config/const.config.js";
import s3 from "../../utils/aws-s3.js";
const responser = new Responser();
const router = express.Router();

router.post("/upload/:folder", uploadToFolder, async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" }); // Specific error for missing files
    }

    const uploadedFiles = [];

    for (const file of files) {
      const { size, key, location, mimetype } = file;

      const type = mimetype.split("/")[1];

      // Assuming your File model/library has a create or save method
      const newImg = new File({ size, key, location, type }); // Replace with the appropriate method call
      await newImg.save();
      uploadedFiles.push(newImg);
    }

    return responser.res(res, 201, uploadedFiles);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      model,
      banner,
      news,
      partner,
      portfolio,
      product,
      service,
      slider,
    } = req.body;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }

    const updFile = await File.findByIdAndUpdate(
      id,
      {
        for: model,
        banner,
        news,
        partner,
        portfolio,
        product,
        service,
        slider,
      },
      { new: true }
    );

    return responser.res(res, 200, updFile);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
        success: false,
      });
    }

    const params = {
      Bucket: bucket,
      Key: file.key,
    };
    await File.findByIdAndDelete(id);
    s3.deleteObject(params, (err, data) => {
      if (err) {
        return responser.errorHandler(res, err);
      }
      {
        return responser.res(res, 200, false, "File deleted successfully");
      }
    });
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});
export default router;
