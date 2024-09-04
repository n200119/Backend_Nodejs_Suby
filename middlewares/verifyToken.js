const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Vendor = require("../models/Vendor");

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json("token is not get from header");
  }
  try {
    const decoded = jwt.verify(token, process.env.WhatIsYourName);
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      return res.status(401).json("token is not valid");
    }
    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.log(`internal server err at verifyToken:${error}`);
    return res.status(500).json("internal serv err");
  }
};

module.exports = verifyToken;
