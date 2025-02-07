const express = require("express");
const secure = require("ssl-express-www");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const log = require("./routes/log");
const config = require("./config.json");
const utils = require("./utils.js");
const ApiRequestCount = require("./routes/ApiRequestCount.js");
const app = express();

// MongoDB connection
mongoose.connect("mongodb+srv://xnil6x143:HaogAjelhhZehn5i@cluster0.htr4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected!");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "includes", "public")));

// Initialize global config
global.config = config;
global.utils = utils;
global.api = new Map();

// Router setup
const router = require("./routes/router");
app.use(router);

// Server configuration
app.enable("trust proxy");
app.set("json spaces", 2);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// SSL redirect
app.use(secure);

// Body parser setup with limits
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// API endpoints
app.get("/api-list", (req, res) => {
  try {
    const apiList = Array.from(global.api.values()).map((api) => ({
      name: api.config.name,
      description: api.config.description,
      endpoint: `/xnil${api.config.link}`,
      category: api.config.category,
    }));
    res.json({ total: apiList.length, apis: apiList });
  } catch (error) {
    log.error("Error generating API list:", error);
    res.status(500).json({ error: "Internal server error", message: "Failed to generate API list" });
  }
});

//xapi
app.get("/xapi", (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const apiList = Array.from(global.api.values()).map((api, index) => ({
      serial: index + 1,
      name: api.config.name,
      description: api.config.description,
      endpoint: `${baseUrl}/xnil${api.config.link}`,
      category: api.config.category,
    }));

    res.json({
      total: apiList.length,
      apis: apiList,
    });
  } catch (error) {
    log.error("Error generating API list:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to generate API list",
    });
  }
});

/*app.get("/api-stats2", async (req, res) => {
  try {
    const apiCounts = await ApiRequestCount.find({});
    res.json(apiCounts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching API stats", message: error.message });
  }
});*/

app.get("/api-stats", async (req, res) => {
  try {
    const totalRequests = await ApiRequestCount.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);

    res.json({ totalRequests: totalRequests[0]?.total || 0 });
  } catch (error) {
    console.error("Error fetching total API requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Static HTML routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "index.html"));
});

app.get("/xnil", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "index2.html"));
});

app.get("/command", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "command.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "about.html"));
});

app.get("/tikdl", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "tikdl.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "includes", "public", "404.html"));
});

// Error handler
app.use((err, req, res, next) => {
  log.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
  });
});

// Server initialization
const PORT = process.env.PORT || global.config.port || 3000;
const server = app.listen(PORT, () => {
  log.main(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  log.main("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    log.main("HTTP server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  log.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  log.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
