import express from "express";
import Product from "../models/Product.js"; // Ensure correct path
import Responser from "../../utils/responser.js";
import FileController from "../../controllers/file.controller.js";

const responser = new Responser();
const router = express.Router();
const file = new FileController();

// Create a new Product
router.post("/", async (req, res) => {
  try {
    const {
      images,
      translations,
      price,
      show_price,
      service,
      shortDescription,
      banner,
    } = req.body;
    const product = new Product({
      images,
      translations,
      price,
      show_price,
      service,
      shortDescription,
      banner,
    });
    const savedProduct = await product.save();
    return responser.res(res, 201, savedProduct);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const { search, service } = req.query;
    let query = {};

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query = {
        $or: [
          { "translations.eng.name": searchRegex },
          { "translations.eng.description": searchRegex },
          { "translations.ru.name": searchRegex },
          { "translations.ru.description": searchRegex },
          { "translations.uz.name": searchRegex },
          { "translations.uz.description": searchRegex },
        ],
      };
    }

    if (service) {
      query.service = service;
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .populate("images service banner");

    const totalDocuments = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    const response = {
      products,
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

    const product = await Product.findById(id).populate(
      "images service banner"
    );

    if (!product) {
      return responser.res(res, 404, false, "Not found");
    }

    return responser.res(res, 200, product);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read a specific Product entry by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "images category banner"
    );
    if (product) {
      return responser.res(res, 200, product);
    } else {
      return responser.res(res, 404, { message: "Product not found" });
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a Product entry by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      images,
      translations,
      price,
      show_price,
      service,
      shortDescription,
      banner,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images,
        translations,
        price,
        show_price,
        service,
        shortDescription,
        banner,
      },
      { new: true }
    ).populate("images service");

    if (updatedProduct) {
      return responser.res(res, 200, updatedProduct);
    } else {
      return responser.res(res, 404, { message: "Product not found" });
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a Product entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return responser.res(res, 404, { message: "Product not found" });
    }

    await file.DeleteMany(deletedProduct.images);
    return responser.res(res, 200, { message: "Product deleted" });
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
