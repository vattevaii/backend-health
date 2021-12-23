const router = require("express").Router();
const recordController = require("../controllers/recordController");
const isAuthenticated = require("../middlewares/auth");
// const isAuthorized = require("../middlewares/auth");

// Create a record
router.post("/", isAuthenticated, recordController.create);


// Get all records
router.get("/", isAuthenticated, recordController.getAllRecords);

// Get all records of an expert
router.get(
  "/expert/:expertId/records",
  isAuthenticated,
  recordController.getRecordsByExpert
);

// Get record by majorId
router.get(
  "/majorId/:majorId",
  recordController.getRecordByMajorId
);

// Get all records of a person
router.get(
  "/:personId/records",
  isAuthenticated,
  recordController.getRecordsOfPerson
);


// Ensure vaccination of a person
router.post("/:personId/records", recordController.ensureVaccine);

// Delete a record
router.delete("/:id", isAuthenticated, recordController.delete);

module.exports = router;
