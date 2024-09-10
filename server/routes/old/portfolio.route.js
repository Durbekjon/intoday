import express from "express";
import Portfolio from "../models/Portfolio.js"; // Ensure correct path
import Responser from "../../utils/responser.js";
import FileController from "../../controllers/file.controller.js";

const responser = new Responser();
const router = express.Router();
const file = new FileController();

// Create a new Portfolio
router.post("/", async (req, res) => {
  try {
    const {
      images,
      translations,
      price,
      show_price,
      service,
      banner,
      shortDescription,
    } = req.body;
    const portfolio = new Portfolio({
      images,
      translations,
      price,
      show_price,
      service,
      banner,
      shortDescription,
    });
    const savedPortfolio = await portfolio.save();
    return responser.res(res, 201, savedPortfolio);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read all Portfolio entries with pagination and search
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search ? req.query.search : "";

  try {
    const query = {
      $or: [
        { "translations.eng.name": { $regex: search, $options: "i" } },
        { "translations.ru.name": { $regex: search, $options: "i" } },
        { "translations.uz.name": { $regex: search, $options: "i" } },
        { "translations.eng.description": { $regex: search, $options: "i" } },
        { "translations.ru.description": { $regex: search, $options: "i" } },
        { "translations.uz.description": { $regex: search, $options: "i" } },
      ],
    };

    const portfolios = await Portfolio.find(query)
      .skip(skip)
      .limit(limit)
      .populate("images service banner");

    const totalDocuments = await Portfolio.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const response = {
      portfolios,
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

    const portfolio = await Portfolio.findById(id).populate(
      "images service banner"
    );

    if (!portfolio) {
      return responser.res(res, 404, false, "Not found");
    }

    return responser.res(res, 200, portfolio);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read a specific Portfolio entry by ID
router.get("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).populate(
      "images service"
    );
    if (portfolio) {
      return responser.res(res, 200, portfolio);
    } else {
      return responser.res(res, 404, { message: "Portfolio not found" });
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a Portfolio entry by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      images,
      translations,
      price,
      show_price,
      service,
      banner,
      shortDescription,
    } = req.body;

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        images,
        translations,
        price,
        show_price,
        service,
        banner,
        shortDescription,
      },
      { new: true }
    ).populate("images service banner");

    if (updatedPortfolio) {
      return responser.res(res, 200, updatedPortfolio);
    } else {
      return responser.res(res, 404, { message: "Portfolio not found" });
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a Portfolio entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) {
      return responser.res(res, 404, { message: "Portfolio not found" });
    }
    await file.DeleteMany(deletedPortfolio.images);
    return responser.res(res, 200, { message: "Portfolio deleted" });
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
