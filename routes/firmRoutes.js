const firmController = require("../controllers/firmController");
const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/add-firm", verifyToken, firmController.addFirm);
router.delete("/:firmId",firmController.deleteFirmById);

router.get("/uploads/:imageName",async(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent("Content-Type","image/jpeg");
    res.sendFile(path.join(__dirname,"..","uploads",imageName));
})

module.exports = router;
