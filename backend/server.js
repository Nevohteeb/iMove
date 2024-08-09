require('dotenv').config();
const mongoUsername = process.env.MONGODB_USERNAME
const mongoPassword = process.env.MONGODB_PASSWORD
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// allow cross origin requests
const cors = require('cors');

const port = 4000

app.use(express.json())
// Call on Express to use CORS
app.use(cors())

// import routes
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/commentRoutes")


// log the path and method of each request
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next()
})

// Attach our route to our app (express)
app.use('/api/workouts/', workoutRoutes);
app.use ('/api/user', userRoutes);
app.use('/api/comments', commentRoutes); // Use the comment routes
// Serve static files fromupblic/uplaods
app.use('/public/uploads', express.static('public/uploads'))

// Mongo connection string
const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.0zscr9m.mongodb.net/?retryWrites=true&w=majority`

// Sets up the browser - defined what will be shown in the browser
app.get('/', (req, res) => {
    res.send("Hello, this is your Express Server!") // See in browser
})

// Set up server to listen to the port - logs out terminal that is listening when it starts for the first time
// Because of nodemon and it restarting each time we make a change it should log this out again each time
app.listen(port, () => {
    console.log(`Express backend server is running on localhost:${port}`); // Sent to the terminal
})

// Connect to mongo using mongoose
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { // then for a success
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => { // catch for a fail/error
        console.error("Error connecting to MongoDB Atlas", err);
    })

