const express = require("express");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const path = require("path");

// Initialize the S3 client with your credentials and region
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure Multer Storage with S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mygymmonkey', // Replace with your S3 bucket name
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext); // Use unique filenames
        }
    })
});

// Use express router
const router = express.Router();

// Import controller functions
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
} = require("../controllers/workoutController");

// Set up routes
router.get("/", getWorkouts); // GET all workouts
router.get("/:id", getWorkout); // GET single workout
router.post('/', upload.single('image'), createWorkout); // POST a new workout
router.delete('/:id', deleteWorkout); // DELETE a workout
router.patch('/:id', updateWorkout); // UPDATE a workout

// Export the module
module.exports = router;
