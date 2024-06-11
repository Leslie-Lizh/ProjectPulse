const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");
const { verifyJWT } = require("../../config/verifyMiddleware")

router.get("/", usersCtrl.showUsers)

router.post("/", usersCtrl.createUser)

router.post("/login", usersCtrl.login)

router.get("/admin/projects", usersCtrl.showAllProjects)

router.get("/:userName/projects", usersCtrl.showUserProjects)

router.get("/admin/tasks", usersCtrl.showAllTasks)

router.get("/:userName/tasks", usersCtrl.showUserTasks)

router.patch("/admin/tasks/:taskId", verifyJWT, usersCtrl.editTask)

router.delete("/admin/tasks/:taskId", verifyJWT, usersCtrl.deleteTask)

router.post("/admin/tasks", verifyJWT, usersCtrl.createTask)

router.patch("/user/tasks/:taskId", verifyJWT, usersCtrl.completeTask)

router.patch("/:userId/password", verifyJWT, usersCtrl.changePassword)

module.exports = router;