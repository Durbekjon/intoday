import express from "express";
import Partner from "../models/Partner.js"; // Assuming partner.js is in the 'models' folder
import Responser from "../../utils/responser.js";
import AuthMiddleware from "../../middleware/auth.middleware.js";
import FileController from "../../controllers/file.controller.js";

const responser = new Responser();
const router = express.Router();
const file = new FileController();

let partners = null;
let globalQuery = null;

// Create a new partner (POST)
router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const { image, name, translations, link, shortDescription } = req.body;
    const newPartner = new Partner({
      image,
      name,
      translations,
      link,
      shortDescription,
    });
    await newPartner.save();
    partners = null;
    globalQuery = null;

    return responser.res(res, 201, newPartner);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read all partners (GET)
router.get("/", async (req, res) => {
  try {
    if (JSON.stringify(globalQuery) !== JSON.stringify(req.query)) {
      globalQuery = { ...req.query };
      const { search } = req.query;

      const query = { ...req.query };
      delete query.limit;
      delete query.page;
      delete query.search;

      const searchConditions = search
        ? {
            $or: [
              { name: { $regex: search, $options: "xi" } },
              {
                "language.ru.description": { $regex: search, $options: "xi" },
              },
              {
                "language.uz.description": { $regex: search, $options: "xi" },
              },
              {
                "language.eng.description": {
                  $regex: search,
                  $options: "xi",
                },
              },
            ],
          }
        : {};

      const combinedQuery = { ...query, ...searchConditions };

      partners = await Partner.find(combinedQuery).populate({
        path: "image",
        select: "location",
      });

      return responser.res(res, 200, partners);
    }

    return responser.res(res, 200, partners);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const partner = await Partner.findById(id).populate({
      path: "image",
      select: "location",
    });

    if (!partner) {
      return responser.res(res, 404, false, "Partner not found");
    }

    return responser.res(res, 200, partner);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a partner by ID (PUT)
router.put("/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { image, name, translations, link, shortDescription } = req.body;
  try {
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { image, name, translations, link, shortDescription },
      {
        new: true,
      }
    ); // Return the updated document
    if (!updatedPartner) {
      return responser.res(res, 404, false, "Partner not found"); // Send error if partner not found with status 404 (Not Found)
    }
    partners = null;
    globalQuery = null;

    return responser.res(res, 200, updatedPartner);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a partner by ID (DELETE)
router.delete("/:id", AuthMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPartner = await Partner.findByIdAndDelete(id);
    if (!deletedPartner) {
      return responser.res(res, 404, false, "Partner not found"); // Send error if partner not found with status 404 (Not Found)
    }

    partners = null;
    globalQuery = null;
    await file.DeleteMany([deletedPartner.image]);

    return responser.res(res, 200, false, "Partner deleted successfully");
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
