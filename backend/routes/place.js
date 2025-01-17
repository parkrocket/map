const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");

router.post("/list", placeController.list);
module.exports = router;
