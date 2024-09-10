import express from "express";
import Banner from "../models/Banner.js";
import Responser from "../../utils/responser.js";
import AuthMiddleware from "../../middleware/auth.middleware.js";
import FileController from "../../controllers/file.controller.js";

const responser = new Responser();
const router = express.Router();
const file = new FileController();
let banner = null;
let globalQuery = null;

// Create a new Banner
router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const {
      image,
      translations,
      product,
      portfolio,
      news,
      link,
      type,
      service,
      shortDescription,
    } = req.body;
    const newBanner = new Banner({
      image,
      type,
      translations,
      product,
      portfolio,
      service,
      news,
      link,
      shortDescription,
    });

    const savedBanner = await newBanner.save();
    banner = null;
    globalQuery = null;
    return responser.res(res, 201, savedBanner);
  } catch (error) {
    // console.log(error);
    return responser.errorHandler(res, error);
  }
});

// Read all Banner entries with optional pagination and search
router.get("/", async (req, res) => {
  try {
    if (!banner) {
      const BannerList = await Banner.find()
        .populate({ path: "image", select: "location" })
        .populate({
          path: "news",
          populate: [
            {
              path: "banner",
              select: "location",
            },
            {
              path: "image",
              select: "location",
            },
          ],
        })
        .populate({
          path: "product",
          populate: [
            {
              path: "images",
              select: "location",
            },
            {
              path: "banner",
              select: "location",
            },
          ],
        })
        .populate({
          path: "portfolio",
          populate: [
            {
              path: "images",
              select: "location",
            },
            {
              path: "banner",
              select: "location",
            },
          ],
        })
        .populate({
          path: "service",
          populate: [
            {
              path: "images",
              select: "location",
            },
            {
              path: "banner",
              select: "location",
            },
          ],
        });
      // .populate({
      //   path: "product",
      //   populate: [
      //     {
      //       path: "service",
      //     },
      //     {
      //       path: "images",
      //       select: "location",
      //     },
      //   ],
      // })
      // .populate({
      //   path: "service",
      //   populate: [
      //     {
      //       path: "images",
      //       select: "location",
      //     },
      //   ],
      // })
      // .populate("image product portfolio news")
      // .exec();
      return responser.res(res, 200, BannerList);
    } else {
      return responser.res(res, 200, banner);
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const banner = await Banner.findById(id).populate(
      "image product portfolio news"
    );

    if (!banner) {
      return responser.res(res, 404, false, "Not found");
    }

    return responser.res(res, 200, banner);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a Banner entry by ID
router.put("/:id", AuthMiddleware, async (req, res) => {
  try {
    const {
      image,
      type,
      translations,
      product,
      portfolio,
      news,
      link,
      shortDescription,
    } = req.body;

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        image,
        type,
        translations,
        product,
        portfolio,
        news,
        link,
        shortDescription,
      },
      { new: true }
    ).populate("image product portfolio news");
    if (updatedBanner) {
      banner = null;
      globalQuery = null;
      return responser.res(res, 200, updatedBanner);
    } else {
      return responser.res(res, 404, false, "Banner not found");
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a Banner entry by ID
router.delete("/:id", AuthMiddleware, async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return responser.res(res, 404, false, "Banner not found");
    }
    await file.DeleteMany(deletedBanner.images);

    banner = null;
    globalQuery = null;
    return responser.res(res, 200, false, "Banner deleted");
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
