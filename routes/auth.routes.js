const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", fileUploader.single('profileImage'), (req, res, next) => {
  const { email, password, name, username, gender, country, phoneNumber, birthdate, profileImage} = req.body;
  // Check if email or password or name are provided as empty strings
  if (username.indexOf(' ') >= 0) {
    res.status(400).json({ message: "Username can't have spaces." });
    return;
  }
  if (email === "" || password === "" || name === "" || username === "" || gender === "" || country === "" || phoneNumber === "") {
    res.status(400).json({ message: "Please fill in all fields" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, name: name.trim(), username: username.trim() , gender, country, phoneNumber, birthdate, profileImage: req.file.path}); //UPDATE MODEL ---ternari if file exists
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id, username, gender, country, phoneNumber, birthdate, profileImage} = createdUser; //UPDATE MODEL

      // Create a new object that doesn't expose the password
      const user = { email, name, _id, username, gender, country, phoneNumber, birthdate, profileImage}; //UPDATE MODEL

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // Check if email or password are provided as empty string
  if (username === "" || password === "") {
    res.status(400).json({ message: "Provide username and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, username, gender, country, phoneNumber, birthdate, profileImage } = foundUser; //REVIEW THIS, do we need to deconstruct all user properties?

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, username, usernameMod:"moderator", gender, country, phoneNumber, birthdate, profileImage };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "24h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
