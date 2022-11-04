const express = require("express");
const User = require("../models/User.model");
const router = express.Router();

// Profile Page --> /:username/
router.get("/profile", (req, res, next) => {
    User.findOne({"username":req.params.username})
    .populate ("friendsToAccept")
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.json(error));
  });

// Profile Page, edit --> /:username/edit
router.put("/edit", (req, res, next) => {
    const { profileImage, name, username, description, birthdate, mail, phoneNumber } = req.body;
    const updatedProfile = {
        profileImage: req.body.profileImage,
        name: req.body.name,
        username: req.body.username,
        description: req.body.description,
        birthdate: req.body.birthdate,
        mail: req.body.mail,
        phoneNumber: req.body.phoneNumber
      };
    User.findOneAndUpdate({"username": req.params.username}, updatedProfile, returnNewDocument)
      .then((result) => {
        res.json("user updated with: ",result);
      })
      .catch((error) => res.json(error));
  });

 // Profile Page, friends --> /:username/friends
router.get("/friends", (req, res, next) => {
    User.findOne({"username":req.params.username})
    .populate("friends")
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.json(error));
  }); 

 // All users using DPlan --> /:username/addFriends
 router.get("/addFriends", (req, res, next) => {
    User.find()
    .then((result) => {
        const res = result.filter(user => {
            return user.username != req.params.username
        })
        res.json(res); //retorna tots el users menys "JO". Com tornar tots menys "JO" i el "MEUS" amics.
      })
    .catch((error) => res.json(error));

    // User.findOne(req.params.username)
    // .populate("friends")
    // .populate("friendsRequested")
    // .populate("friendsToAccept")
    //   .then((result) => {
    //     res.json(result);
    //   })
    //   .catch((error) => res.json(error));
  }); 

// Profile Page, edit --> /:username/friendRequest/:idPerson
router.post("/:username/friendRequest/:idPerson", (req, res, next) => {
    const username = req.params.username
    const idPerson = req.params.idPerson
    User.findOne({"username": req.params.username})
      .then((result) => {
        let usernameId = result._id
        result.friendsRequested.push(idPerson)
        // res.json("user updated with: ",result);
        User.findById(idPerson)
            .then((result) => {
            result.friendsToAccept.push(usernameId)
            res.json("Friend Request done succesfully");
        })
            .catch((error) => res.json(error));
      })
      .catch((error) => res.json(error));
  });

module.exports = router;