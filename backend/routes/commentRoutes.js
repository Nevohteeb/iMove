const express = require('express');
const router = express.Router();
const {
    createComment,
    editComment,
    deleteComment,
} = require('../controllers/commentController');

// Create a new comment for a specific workout
router.post('/workouts/:workoutId/comments', createComment);

// Edit an existing comment
router.patch('/workouts/:workoutId/comments/:commentId', editComment);

// Delete a comment
router.delete('/workouts/:workoutId/comments/:commentId', deleteComment);

module.exports = router;
