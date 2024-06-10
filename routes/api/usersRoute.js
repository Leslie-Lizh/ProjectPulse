const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");

router.get("/", usersCtrl.showUsers)

router.post("/", usersCtrl.createUser)

router.post("/login", usersCtrl.login)

router.get("/admin/projects", usersCtrl.showAllProjects)

router.get("/:userName/projects", usersCtrl.showUserProjects)

router.get("/admin/tasks", usersCtrl.showAllTasks)

router.get("/:userName/tasks", usersCtrl.showUserTasks)

router.patch("/admin/tasks/:taskId", usersCtrl.editTask)

router.delete("/adim/tasks/:taskId", usersCtrl.deleteTask)

router.post("/admin/tasks", usersCtrl.createTask)

module.exports = router;