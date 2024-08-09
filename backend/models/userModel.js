const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Change to bcryptjs
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// static method for user sign up
userSchema.statics.signup = async function (email, password) {
    
    // Check to see if we have a value for the email or password
    if (!email || !password) {
        throw Error('All fields must be filled out.')
    }

    // Check to see if email is valid
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.')
    }

    // Check to see if password is strong enough
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use');
    }

    // Generate a Salt with a cost of 10 - (10 is the default)
    const salt = await bcrypt.genSalt(10);

    // Hash both the password and the salt combined
    const hash = await bcrypt.hash(password, salt);

    // Set the password to the hash value when creating the user
    const user = await this.create({ email, password: hash });

    return user;
}

// static login method
userSchema.statics.login = async function (email, password) {
    // Check if password and email values exist
    if (!email || !password) {
        throw Error("All fields must be filled in.")
    }

    // Try and find user on the database via the email provided
    const user = await this.findOne({ email });
    
    // If no user is found
    if (!user) {
        throw Error("Incorrect Email.")
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    
    // Throw error if they don't match
    if (!match) {
        throw Error("Incorrect Password.")
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);
