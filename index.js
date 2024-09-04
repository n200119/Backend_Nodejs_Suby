const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const bodyParser = require("body-parser");
const productRoutes= require("./routes/productRoutes");
const path = require("path");

dotEnv.config();

const app = express();

const PORT = process.env.PORT || 4000;

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

app.use("/",(req,res)=>{
  res.send("<h1>welcome to suby</h1>");
})

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product",productRoutes);
app.use("/uploads",express.static("uploads"));