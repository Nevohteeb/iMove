const Comment = require('../models/commentModel');
const Workout = require('../models/workoutModel');

// Create a new comment and associate it with a workout
const createComment = async (req, res) => {
    const { workoutId } = req.params;

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const newComment = new Comment({
            text: req.body.text,
            user_id: req.body.user_id,
        });

        await newComment.save();

        workout.comments.push(newComment);
        await workout.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit an existing comment
const editComment = async (req, res) => {
    const { workoutId, commentId } = req.params;

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            {
                text: req.body.text,
            },
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a comment and remove its reference from the workout
const deleteComment = async (req, res) => {
    const { workoutId, commentId } = req.params;

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        const comment = await Comment.findByIdAndRemove(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Remove the comment reference from the workout
        workout.comments = workout.comments.filter(
            (comment) => comment.toString() !== commentId
        );

        await workout.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createComment, editComment, deleteComment };
