const express = require("express");
const router = express.Router();
const {
  getAllTyres,
  getTyresBySize,
  getTyresByModel,
  getTyresByType,
  updateInStock,
  addTyre,
  deleteTyre,
  updateTyreImage,
  upload
} = require("../controllers/tyreallController");

// Routes
router.get("/", getAllTyres);
router.post("/size", getTyresBySize);
router.get("/model/:model", getTyresByModel);
router.get("/type/:type", getTyresByType);
router.put("/update-stock/:id", updateInStock);

router.post("/add", upload, addTyre);
router.put("/update-image/:id", upload, updateTyreImage);
router.delete("/delete/:id", deleteTyre);

module.exports = router;
