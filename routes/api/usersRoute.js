const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");

router.get("/", usersCtrl.show)

module.exports = router;