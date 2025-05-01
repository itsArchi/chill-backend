const Series = require("../models/Series");
const { Op } = require("sequelize");

// GET ALL SERIES
exports.getAllSeries = async (req, res) => {
  try {
    const { title, rating, sortBy, order, search } = req.query;

    let where = {};

    if (rating) {
      where.rating = rating;
    }

    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }

    let orderQuery = [];
    if (sortBy) {
      orderQuery.push([
        sortBy,
        order?.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ]);
    }

    const series = await Series.findAll({
      where,
      order: orderQuery,
    });

    res.json(series);
  } catch (error) {
    res.status(500).json({ message: "Error fetching series", error });
  }
};

// GET SERIES BY ID
exports.getSeriesById = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

  try {
    const series = await Series.findOne({ where: { id } });
    if (!series) return res.status(400).json({ message: "Series not found" });
    res.json({ message: "Series found", series });
  } catch (error) {
    res.status(500).json({ message: "Error finding series", error });
  }
};

// ADD SERIES
exports.addSeries = async (req, res) => {
  const { id, title, description, total_episode, release_date, rating } =
    req.body;
  if (!title || !description || !total_episode || !release_date || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newSeries = await Series.create({
      id,
      title,
      description,
      total_episode,
      release_date,
      rating,
    });
    res.status(201).json({ message: "Series created successfully", newSeries });
  } catch (error) {
    console.error("CREATE SERIES ERROR:", error);
    res.status(500).json({ message: "Error creating series", error });
  }
};

// UPDATE SERIES
exports.updateSeries = async (req, res) => {
  const { id } = req.params;
  const { title, description, total_episode, release_date, rating } = req.body;
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

  try {
    const series = await Series.findOne({ where: { id } });
    if (!series) return res.status(400).json({ message: "Series not found" });

    await series.update({
      title,
      description,
      total_episode,
      release_date,
      rating,
    });
    res.status(200).json({ message: "Series updated successfully", series });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating series", error });
  }
};

// DELETE SERIES
exports.deleteSeries = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Series.destroy({ where: { id } });
    if (!deleted) return res.status(400).json({ message: "Series not found" });
    res.json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting series", error });
  }
};
