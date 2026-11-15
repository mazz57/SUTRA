const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const disasterRoutes = require("./routes/disaster.routes");
const shelterRoutes = require("./routes/shelter.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const resourceRoutes = require("./routes/resource.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/disasters", disasterRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/resources", resourceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
