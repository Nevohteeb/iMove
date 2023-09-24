const mongoose = require('mongoose');

const Schema = mongoose.Schema

const workoutSchema = new Schema({
    // Define my rules for the data
    // key : dataType, required=true - only add required if you want to enforce this value
    title: {
        // dataType = String
        type: String,
        // set it to required
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment', // Reference the Comment model
        },
    ]
}, {timestamps: true})

module.exports = mongoose.model("Workout", workoutSchema)