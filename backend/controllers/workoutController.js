const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// Get all workouts with comments populated
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).populate({
            path: 'comments',
            model: 'Comment'
        }).sort({ createdAt: -1 });

        res.status(200).json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single workout with comments populated
const getWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Workout: Id invalid' });
    }

    try {
        const workout = await Workout.findById(id).populate({
            path: 'comments',
            model: 'Comment'
        });

        if (!workout) {
            return res.status(404).json({ error: 'No such Workout: Workout does not exist' });
        }

        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a New Workout
const createWorkout = async (req, res) => {
    const { title, load, reps, user_id } = req.body;
    const imageKey = req.file ? req.file.key : null; // Save S3 key instead of filename

    try {
        const workout = await Workout.create({
            title,
            load,
            reps,
            user_id,
            image: imageKey // Save the S3 key
        });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Workout: Id invalid' });
    }

    try {
        const workout = await Workout.findOneAndDelete({ _id: id });

        if (!workout) {
            return res.status(404).json({ error: 'No such Workout; Workout does not exist' });
        }

        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Workout: Id invalid' });
    }

    const updatedWorkoutData = {
        ...req.body
    };

    try {
        const workout = await Workout.findOneAndUpdate({ _id: id }, updatedWorkoutData, { new: true });

        if (!workout) {
            return res.status(404).json({ error: 'No such Workout; Workout does not exist' });
        }

        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
};
