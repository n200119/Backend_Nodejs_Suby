const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json("vendor not found");
    }

    if(vendor.firm.length>0)
      {
        return res.status(400).json({message:"only single firm should be added"});
      }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    const firmId = savedFirm._id

    vendor.firm.push(savedFirm);

    await vendor.save();


    return res.status(200).json({message:"firm added succesfully",firmId,firmName});
  } catch (error) {
    console.log(`error at firm adding:${error}`);
    res.status(500).json("int ser err");
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) {
      return res.status(404).json("firm not found");
    }
    res.status(200).json("firm deleted");
  } catch (error) {
    console.log(`err at deleting the firm:${error}`);
    res.status(500).json("internal serbver error");
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
