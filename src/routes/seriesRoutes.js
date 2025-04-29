const express = require("express");
const {
  getAllSeries,
  getSeriesById,
  addSeries,
  updateSeries,
  deleteSeries,
} = require("../controller/seriesController");

const {
  createSeriesValidation,
  updateSeriesValidation,
  idValidation,
} = require("../middleware/seriesValidation");

const router = express.Router();

router.get("/series", getAllSeries);
router.get("/series/:id", idValidation, getSeriesById);
router.post("/series", createSeriesValidation, addSeries);
router.patch("/series/:id", updateSeriesValidation, updateSeries);
router.delete("/series/:id", idValidation, deleteSeries);

module.exports = router;
