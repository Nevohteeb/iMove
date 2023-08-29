// import the user model
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

// create token function
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        // Call upon our custom login static method
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})

    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

// signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    // sign up user
    try {
        // Call upon the custom sign up static method defined in our userModel
        const user = await User.signup(email, password)

        // create token
        const token = createToken(user._id)

        // return the email and newly created user
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    signupUser,
    loginUser
}