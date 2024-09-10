import { Router } from "express";
import Responser from "../../utils/responser.js";
import Company from "../../models/Company.js";
import AuthMiddleware from "../../middleware/auth.middleware.js";
import FileController from "../../controllers/file.controller.js";

const file = new FileController();
const responser = new Responser();
const router = Router();

let settings = null;
let globalQuery = null;

router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const {
      name,
      logo1_default, // Assuming this is the intended logo field
      logo1_mini,
      logo2_default,
      logo2_mini,
      translations,
      statistics,
      location,
      mail,
      phone1,
      phone2,
      phone3,
      social,
      showPrice,
    } = req.body;

    const check = await Company.findOne();
    if (check) {
      return responser.res(res, 403, false, "Company already exists");
    }

    const newCompany = await new Company({
      name,
      logo1_default,
      logo1_mini,
      logo2_default,
      logo2_mini,
      translations,
      statistics,
      location,
      mail,
      phone1,
      phone2,
      phone3,
      social,
      showPrice,
    });

    await newCompany.save();

    settings = null;
    globalQuery = null;
    return responser.res(res, 201, newCompany);
  } catch (error) {
    // Handle errors appropriately (e.g., logging, sending error response)
  }
});

router.get("/", async (req, res) => {
  try {
    if (JSON.stringify(globalQuery) !== JSON.stringify(req.query)) {
      globalQuery = { ...req.query };

      settings = await Company.findOne().populate(
        "logo1_default logo1_mini logo2_default logo2_mini"
      );

      if (!settings) {
        settings = null;
        globalQuery = null;
        return responser.res(res, 404, false, "Company not found");
      }

      return responser.res(res, 200, settings);
    }

    return responser.res(res, 200, settings);
  } catch (error) {
    return responser.errorHandler(res, error);
  }
});
router.put("/", AuthMiddleware, async (req, res) => {
  try {
    const check = await Company.findOne();
    if (!check) {
      return responser.res(res, 404, false, "Company not found");
    }

    const {
      name,
      logo1_default, // Assuming this is the intended logo field
      logo1_mini,
      logo2_default,
      logo2_mini,
      translations,
      statistics,
      location,
      mail,
      phone1,
      phone2,
      phone3,
      social,
      showPrice,
    } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      check.id,
      {
        name,
        logo1_default,
        logo1_mini,
        logo2_default,
        logo2_mini,
        translations,
        statistics,
        location,
        mail,
        phone1,
        phone2,
        phone3,
        social,
        showPrice,
      },
      { new: true } // Return the updated document
    );
    settings = null;
    globalQuery = null;
    return responser.res(res, 200, updatedCompany);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return responser.errorHandler(res, error); // Send a generic error response
  }
});

router.delete("/", AuthMiddleware, async (req, res) => {
  try {
    const check = await Company.findOne();
    if (!check) {
      return responser.res(res, 404, false, "Company not found");
    }

    await Company.findByIdAndDelete(check.id);
    settings = null;
    globalQuery = null;
    const images = [
      `${check.logo1_default}`,
      `${check.logo1_mini}`,
      `${check.logo2_default}`,
      `${check.logo2_mini}`,
    ];
    await file.DeleteMany(images);
    return responser.res(res, 200, false, "Company deleted successfully");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return responser.errorHandler(res, error); // Send a generic error response
  }
});

export default router;
