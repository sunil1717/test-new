const mongoose = require("mongoose");

const TyreSchema = new mongoose.Schema({
  Brand: { type: String },
  SIZE: { type: String },
  "LOAD/SPEED RATING": { type: String },
  Model: { type: String },
  Type: { type: String },
  Marking: { type: String, default: null },
  RunFlat: { type: String, default: null },
  "Price Incl GST": { type: Number },
  "In Stock": { type: String },
  "UNLOADING IN 24 HRS": { type: Number },
  image_url: { type: String }
});

// Explicitly bind to the existing collection: "tyre_stock"
module.exports = mongoose.model("Tyreall", TyreSchema, "tyre_stock");
