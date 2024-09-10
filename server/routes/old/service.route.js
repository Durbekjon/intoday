import express from "express";
import Service from "../models/Service.js";
import Responser from "../../utils/responser.js";
import AuthMiddleware from "../../middleware/auth.middleware.js";
import FileController from "../../controllers/file.controller.js";
const responser = new Responser();
const router = express.Router();
const file = new FileController();

// Create a new service (POST)
router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const {
      images,
      translations,
      tags,
      maxPrice,
      minPrice,
      showPrice,
      shortDescription,
      banner,
    } = req.body;

    const newService = new Service({
      images,
      translations,
      tags,
      maxPrice,
      minPrice,
      showPrice,
      shortDescription,
      banner,
    });
    await newService.save();

    return responser.res(res, 201, newService);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read all services (GET)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const { search } = req.query;

    const query = { ...req.query };
    delete query.limit;
    delete query.page;
    delete query.search;

    const searchConditions = search
      ? {
          $or: [
            { "language.ru.name": { $regex: search, $options: "xi" } },
            { "language.ru.description": { $regex: search, $options: "xi" } },
            { "language.uz.name": { $regex: search, $options: "xi" } },
            { "language.uz.description": { $regex: search, $options: "xi" } },
            { "language.eng.name": { $regex: search, $options: "xi" } },
            {
              "language.eng.description": { $regex: search, $options: "xi" },
            },
          ],
        }
      : {};

    const combinedQuery = { ...query, ...searchConditions };

    const services = await Service.find(combinedQuery)
      .populate({
        path: "images",
        select: "location",
      })
      .populate("banner")
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Service.countDocuments(combinedQuery);
    const totalPages = Math.ceil(totalDocuments / limit);

    const response = {
      services,
      pagination: {
        currentPage: page,
        totalPages,
        totalDocuments,
        pageSize: limit,
      },
    };

    return responser.res(res, 200, response);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const service = await Service.findById(id)
      .populate({
        path: "images",
        select: "location",
      })
      .populate("banner");

    if (!service) {
      return responser.res(res, 404, false, "Not found");
    }

    return responser.res(res, 200, service);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a service by ID (PUT)
router.put("/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    images,
    translations,
    tags,
    maxPrice,
    minPrice,
    showPrice,
    shortDescription,
    banner,
  } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        images,
        translations,
        tags,
        maxPrice,
        minPrice,
        showPrice,
        shortDescription,
        banner,
      },
      { new: true }
    );

    if (!updatedService) {
      return responser.res(res, 404, false, "Service not found");
    }

    return responser.res(res, 200, updatedService);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a service by ID (DELETE)
router.delete("/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return responser.res(res, 404, false, "Service not found");
    }
    await file.DeleteMany(deletedService.images);

    return responser.res(res, 200, false, "Service deleted successfully");
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
