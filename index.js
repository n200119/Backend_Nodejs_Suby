const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const bodyParser = require("body-parser");
const productRoutes= require("./routes/productRoutes");
const path = require("path");
const cors = require("cors");

dotEnv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(`error occured:${err}`);
  });

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`server is running`);
});

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product",productRoutes);
app.use("/uploads",express.static("uploads"));