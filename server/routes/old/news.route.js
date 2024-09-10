import express from "express";
import News from "../models/News.js";
import Responser from "../../utils/responser.js";
import FileController from "../../controllers/file.controller.js";

const responser = new Responser();
const router = express.Router();
const file = new FileController();

let cachedNews = null;
let globalQuery = null;

// Create a new News entry
router.post("/", async (req, res) => {
  try {
    const { image, translations, banner, shortDescription } = req.body;
    const news = new News({
      image,
      translations,
      banner,
      views: 0,
      shortDescription,
    });
    const savedNews = await news.save();
    globalQuery = null;
    cachedNews = null;
    return responser.res(res, 201, savedNews);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Get all News entries with optional pagination and search
router.get("/", async (req, res) => {
  try {
    const currentQuery = JSON.stringify(req.query);
    if (globalQuery !== currentQuery) {
      const { page = 1, limit = 10, search = "" } = req.query;
      const query = search
        ? {
            $or: [
              {
                "translations.eng.description": {
                  $regex: search,
                  $options: "i",
                },
              },
              {
                "translations.ru.description": {
                  $regex: search,
                  $options: "i",
                },
              },
              {
                "translations.uz.description": {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          }
        : {};

      const newsList = await News.find(query)
        .populate("image banner")
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .exec();

      const count = await News.countDocuments(query);
      const totalPages = Math.ceil(count / limit);
      const response = {
        newsList,
        // count,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalDocuments: count,
          pageSize: Number(limit),
        },
      };
      cachedNews = response;
      globalQuery = currentQuery;
      return responser.res(res, 200, response);
    } else {
      return responser.res(res, 200, cachedNews);
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const news = await News.findById(id).populate("image banner");

    if (!news) {
      return responser.res(res, 404, false, "Not found");
    }
    await News.findByIdAndUpdate(id, { views: news.views + 1 });
    globalQuery = null;
    cachedNews = null;
    return responser.res(res, 200, news);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a News entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { image, translations, banner, shortDescription } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { image, translations, banner, shortDescription },
      { new: true }
    ).populate("image");
    if (updatedNews) {
      globalQuery = null;
      cachedNews = null;
      return responser.res(res, 200, updatedNews);
    } else {
      return responser.res(res, 404, { message: "News not found" });
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a News entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return responser.res(res, 404, { message: "News not found" });
    }
    await file.DeleteMany([deletedNews.image]);
    globalQuery = null;
    cachedNews = null;
    return responser.res(res, 200, { message: "News deleted" });
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
