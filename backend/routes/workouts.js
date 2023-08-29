const express = require("express");
const multer = require("multer")
const path = require("path")

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // Store uploads in this directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext); // Use unique filenames
    },
  });

const upload = multer({ storage }) 

// use express router:
const router = express.Router();

// import out controller functions
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
} = require("../controllers/workoutController")

// set up route for each required route
// GET all workouts
router.get("/", getWorkouts)

// GET single workout
router.get("/:id", getWorkout)

// POST a new workout
router.post('/', upload.single('image'), createWorkout)

// DELETE a new workout
router.delete('/:id', deleteWorkout)

// UPDATE an existing workout
router.patch('/:id', updateWorkout)

// Export the module
module.exports = router;