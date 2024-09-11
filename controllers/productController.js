const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path=require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json("firm not found");
    }
    const product = new Product({
      productName,
      price,
      category,
      image,
      bestSeller,
      description,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);

    await firm.save();
    return res.status(200).json("product added succesfully");
  } catch (error) {
    console.log(`err at adding product:${error}`);
    res.status(500).json("internal server error");
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).send("firm not found");
    }

    const restaurantName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).send({ restaurantName,products });
  } catch (error) {
    console.log(`err at getting products:${error}`);
    res.status(500).json("internal server error");
  }
};

const deleteProductById = async (req,res)=>{
  try {
    const productId=req.params.productId;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if(!deletedProduct)
  {
    return res.status(404).json("product not found");
  }
  res.status(200).json("product deleted");
    
  } catch (error) {
    console.log(`err at deleting the product:${error}`);
    res.status(500).json("internal serbver error"); 
  }
}

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById
};
