// Import required modules using require
const express = require("express");
// Create Express app
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require('fs').promises;
const dotenv = require("dotenv");

// Connect to the database and load services
const db = require("./db/mongo.js");
const userService = require("./db/services/userService.js");
db.connectDB();

// Firebase utility functions
const {
    auth,
    adminAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} = require("./utils/firebaseConfig");



// Configure Express app
app.use(cookieParser());
app.use(express.json({ limit: '500mb' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // make sure the 'public' directory exists
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Middleware to authenticate user
async function isAuthenticated(req, res, next) {
    const idToken = req.cookies.token;
    if (idToken) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            const user = await userService.findUserByFirebaseId({
                firebaseId: decodedToken.uid,
            });
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error("Error in isAuthenticated middleware:", error);
            return res.status(401).json({ error: "Unauthorized" });
        }
    } else {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

// Define routes
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/ask", isAuthenticated, (req, res) => {
    res.render("index");
});


app.get("/landing", (req, res) => {
    res.render("landing");
});

// Registration route
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();
        try {
            const userUpdate = await userService.createOrUpdateUser(email, firebaseUser.uid);
            res.cookie("token", idToken, { httpOnly: true });
            res.status(201).json({ status: "Success", user: userUpdate });
        } catch (mongoError) {
            console.error("Error when saving user to MongoDB:", mongoError);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (firebaseError) {
        console.error("Error when creating user in Firebase:", firebaseError);
        res.status(400).json({ error: firebaseError.message });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Email not found" });
        }
        res.cookie("token", idToken, { httpOnly: true });
        return res.json({ status: "Success", redirectUrl: "/ask" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Signout route
app.post("/signout", (req, res) => {
    res.clearCookie("token");
    res.json({ status: "Success" });
});


// Start the server

const port = process.env.PORT || 5000;
async function startServer() {
    try {
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (error) {
        console.error("Failed to start the server:", error);
    }
}
startServer();
