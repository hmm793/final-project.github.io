const express = require("express");
const classRoute = express.Router();
const ClassController = require("./../controllers/kelas");

classRoute.post("/", ClassController.createNewClass);
classRoute.put("/:id", ClassController.editClass);
classRoute.get("/", ClassController.getAllClass);
classRoute.get("/:id", ClassController.getClassByID);
classRoute.get("/getClassBySubject/:id", ClassController.getClassBySubject);

module.exports = classRoute;
