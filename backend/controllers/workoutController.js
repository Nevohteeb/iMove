const { response } = require("express");
const Workout = require("../models/workoutModel");

// import mongoose
const mongoose = require ("mongoose")

// Get all workouts
const getWorkouts = async (req, res) => {
    // sort it in descending order (latest first)
    // .sort({createdAt: -1})
    const workouts = await Workout.find({}).sort({createdAt: -1})
    res.status(200).json(workouts)
}

// Get a single workout
const getWorkout = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Workout: Id invalid'})
    }

    const workout = await Workout.find({_id: id})

    if (!workout) {
        return res.status(404).json({error: 'No such Workout: Workout does not exist'})
    }
    res.status(200).json(workout)
}

// Create a New Workout
const createWorkout = async (req, res) => {
    const {title, load, reps, user_id} = req.body

    const imageFilename = req.file ? req.file.filename : null

    // Add a new doc to the database
    try {
        const workout = await Workout.create({
            title, 
            load, 
            reps, 
            user_id,
            image: imageFilename
        })
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params

    // check if that id is a valid MongoDB id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Workout: Id invalid'})
    }

    const workout = await Workout.findOneAndDelete({_id: id})

    // if the id is valid but there is no workout:
    if (!workout) {
        return res.status(404).json({error: 'No such Workout; Workout does not exist'})
    }

    // if there is a workout and it was deleted:
    res.status(200).json(workout)

}

// Update a workout
const updateWorkout = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Workout: Id invalid'})
    }

    // Find a workout by its id and if it finds it
    // spread out the properties of the req.body
    // it will take whats in the req.body and update the workout with the information
    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body
    }, {new:true})

    if (!workout) {
        return res.status(404).json({error: 'No such Workout; Workout does not exist'})
    }

    res.status(200).json(workout)
}

// export the functions
module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
}