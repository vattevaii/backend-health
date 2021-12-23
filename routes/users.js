const router = require("express").Router();
const userController = require("../controllers/userController");

// Get user by person id
router.get("/person/:id", userController.getPersonById);

// Create a person
router.post("/", userController.create);

// Get all expert user
router.get("/experts", userController.getExperts);

// Get all people
router.get("/people", userController.getPeople);

// Update a user
router.put("/:id", userController.update);

// Delete a user
router.delete("/:id", userController.delete);

// Get user by majorId
router.get("/:majorId", userController.getPersonByMajorId);


module.exports = router;
