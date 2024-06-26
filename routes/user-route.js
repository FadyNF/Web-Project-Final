const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  addUser,
  deleteUser,
  handleUserUpdate
} = require("../controllers/userCtrl");

const { checkUserAuth } = require("../middleware/userAuthenticator");

const {
  renderUserPage,
  renderFavMealsPage,
  renderUserHistoryPage,
  handleLogout,
} = require("../controllers/userCtrl");

// User profile route
router.get("/", checkUserAuth, renderUserPage);

// Favorite meals route
router.get("/favoriteMeals", checkUserAuth, renderFavMealsPage);

// User history route
router.get("/history", checkUserAuth, renderUserHistoryPage);

// Logout route
router.get("/logout", handleLogout);

//get all users
router.get("/allUsers", getAllUsers);

//get one user by id
router.get("/:id", getUserById);

//add user
router.post("/add", addUser);

//update info
// router.post("/updateAccInfo", checkUserAuth, updateUser);
router.post('/', handleUserUpdate)
router.post("/", handleUserUpdate);

//delete user
router.delete("/delete/:id", deleteUser);

module.exports = router;
