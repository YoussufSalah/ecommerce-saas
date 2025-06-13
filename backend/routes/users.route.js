const router = require("express").Router();
const usersController = require("../controllers/users.controller.js");

router
    .route("/")
    .get(usersController.getAllUsers)
    .post(usersController.addUser);
router
    .route("/:id")
    .get(usersController.getUserById)
    .patch(usersController.updateUserById)
    .delete(usersController.deleteUserById);

module.exports = router;
