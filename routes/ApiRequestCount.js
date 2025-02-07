const mongoose = require("mongoose");

const apiRequestCountSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

const ApiRequestCount = mongoose.model("ApiRequestCount", apiRequestCountSchema);

module.exports = ApiRequestCount;
