import express from "express";
import Reception from "../models/Reception.js";
import Responser from "../../utils/responser.js";
import AuthMiddleware from "../../middleware/auth.middleware.js";

const responser = new Responser();
const router = express.Router();

// Create a new Reception entry
router.post("/", async (req, res) => {
  try {
    const { name, phone_number, description, type, product, service } =
      req.body;
    const reception = new Reception({
      name,
      phone_number,
      description,
      type,
      product,
      service,
    });

    const savedReception = await reception.save();
    return responser.res(res, 201, savedReception);
  } catch (error) {
    // console.log(error);
    return responser.errorHandler(res, error);
  }
});

// Read all Reception entries
router.get("/", AuthMiddleware, async (req, res) => {
  try {
    const receptionList = await Reception.find()
      .populate("product service")
      .exec();
    return responser.res(res, 200, receptionList);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Read a specific Reception entry by ID
router.get("/:id", AuthMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const reception = await Reception.findById(id).populate("product service");

    if (!reception) {
      return responser.res(res, 404, false, "Reception not found");
    }
    return responser.res(res, 200, reception);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Update a Reception entry by ID
router.put("/:id", AuthMiddleware, async (req, res) => {
  try {
    const { name, phone_number, description } = req.body;
    const updatedReception = await Reception.findByIdAndUpdate(
      req.params.id,
      { name, phone_number, description, type, product, service },
      { new: true }
    ).exec();
    if (updatedReception) {
      return responser.res(res, 200, updatedReception);
    } else {
      return responser.res(res, 404, false, "Reception not found");
    }
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

// Delete a Reception entry by ID
router.delete("/:id", AuthMiddleware, async (req, res) => {
  try {
    const deletedReception = await Reception.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!deletedReception) {
      return responser.res(res, 404, false, "Reception not found");
    }
    return responser.res(res, 200, false, "Reception deleted");
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});

export default router;
