const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await Vendor.findOne({ email })) {
      return res.status(400).json("email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();
    res.status(201).json({ message: "vendor registered successfully" });
    console.log("registered");
  } catch (error) {
    console.log(`error in vendor controller:${error}`);
    res.status(500).json({ error: "internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (!vendorEmail) {
      return res.status(401).json("username does not exists");
    }
    if (!(await bcrypt.compare(password, vendorEmail.password))) {
      return res.status(401).json("password does not match");
    }
    const token = jwt.sign(
      { vendorId: vendorEmail._id },
      process.env.WhatIsYourName,
      { expiresIn: "1h" }
    );
     const vendorId = vendorEmail._id;
    res.status(200).json({ success: "Login Successfull", token,vendorId });
    console.log(email, "this is token", token);
    console.log(vendorId);
  } catch (error) {
    console.log(`error at login:${error}`);
    res.status(500).json({ message: `${error}` });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    if (!vendors) {
      return res.status(401).json("no vendors got");
    }

    res.status(200).json({ vendors });
  } catch (error) {
    console.log(`error at all vendors getting:${error}`);
    res.status(500).json("internal server error");
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    if (!vendorId) {
      return res.status(401).json("no id is given");
    }

    const vendor = await Vendor.findById(vendorId).populate("firm");

    if (!vendor) {
      return res.status(401).json("no vendor is present with given id");
    }

    const vendorFirmId=vendor.firm[0]._id;
    res.status(200).json({ vendor,vendorFirmId });
    console.log(vendor,vendorFirmId);
  } catch (error) {
    console.log(`error at single vendors getting:${error}`);
    res.status(500).json("internal server error");
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
