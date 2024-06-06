const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");

router.get("/", usersCtrl.show)

router.post("/", usersCtrl.createUser)

router.post("/login", usersCtrl.login)

module.exports = router;