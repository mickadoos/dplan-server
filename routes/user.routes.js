const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fileUploader = require('../config/cloudinary.config')


// User plans Page --> /:username
router.get("/:username", (req, res, next) => {
  User.findOne({"username":req.params.username})
  .populate ("plans._id")
    .then((result) => {
      res.json(result)
    })
    .catch((error) => res.json(error));
});

// Profile Page --> /:username/profile
router.get("/:username/profile", (req, res, next) => {
    User.findOne({"username":req.params.username})
    .populate ("friendsToAccept")
    .populate('friends')
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.json(error));
  });

// Profile Page, edit --> /:username/edit
router.put("/:username/edit", fileUploader.single("profileImage"), (req, res, next) => {
  const { email, name, username, gender, country, phoneNumber, birthdate} = req.body;
  if (email === "" || name === "" || username === "" || gender === "" || country === "" || phoneNumber === "" || birthdate === "") {
    res.status(400).json({ message: "Please fill in all fields" });
    return;
  }
    // const { name, username, description, birthdate, email, phoneNumber, gender } = req.body;
    // const updatedProfile = {
    //     name: req.body.name,
    //     username: req.body.username,
    //     description: req.body.description,
    //     birthdate: req.body.birthdate,
    //     email: req.body.email,
    //     phoneNumber: req.body.phoneNumber,
    //     gender
    //   };
    User.findOneAndUpdate({"username": req.params.username}, (req.file? {"profileImage": req.file.path}:req.body), {new: true})
      .then((result) => {

        const { _id, email, name, username, gender, country, phoneNumber, birthdate, profileImage } = result

        const payload = { _id, email, name, username, usernameMod:"moderator", gender, country, phoneNumber, birthdate, profileImage };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "24h",
        });
        res.json(authToken);
      })
      .catch((error) => res.json(error));
  });

 // Profile Page, friends --> /:username/friends
router.get("/:username/friends", (req, res, next) => {
    User.findOne({"username":req.params.username})
    .populate("friends")
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.json(error));
  }); 

 // All users using DPlan --> /:username/addFriends
 router.get("/:username/addFriends", (req, res, next) => {
    const promUser = User.findOne({"username":req.params.username})
    const promPersons = User.find()
    Promise.all([promUser, promPersons])
    .then(resp => {
      const alreadyFriends = [resp[0]._id, ...resp[0].friends, ...resp[0].friendsRequested, ...resp[0].friendsToAccept] //array de IDs
      User.find({_id: {"$nin": alreadyFriends}})
      .then(resp =>{
        if( resp.length === 0){
          const resp0 = []
          res.json(resp0);
        }
        else {res.json(resp)}
        
      })
      .catch((error) => res.json(error));
    }) 
    .catch((error) => res.json(error));
  }); 

// Profile Page, edit --> /:username/friendRequest/:idPerson
router.post("/:username/friendRequest/:idPerson", (req, res, next) => {
    const username = req.params.username
    const idPerson = req.params.idPerson
    const promUser = User.findOne({"username": username})
    const promPerson = User.findById(idPerson)
    Promise.all([promUser, promPerson])
    .then(resp => {
          if(resp[0].friendsToAccept.includes(idPerson)) {
            return res.json("This user is already in your list");}

          resp[0].friendsRequested.push(idPerson)
          resp[1].friendsToAccept.push(resp[0]._id)
          const promUserUpdate = User.findByIdAndUpdate(resp[0]._id , resp[0], {new:true})
          const promPersonUpdate = User.findByIdAndUpdate(idPerson , resp[1], {new:true})
          Promise.all([promUserUpdate, promPersonUpdate])
          .then(resp => {
            res.json(resp)
          })
          .catch((error) => res.json(error));
        })
        .catch((error) => res.json(error));
  })
  // User.findOne({"username": username})
    //   .then((result) => {
    //     let usernameId = result._id
    //     result.friendsRequested.push(idPerson)
    //     // res.json("user updated with: ",result);
    //     User.findById(idPerson)
    //         .then((result) => {
    //         result.friendsToAccept.push(usernameId)
    //         res.json("Friend Request done succesfully");
    //     })
    //         .catch((error) => res.json(error));
    //   })
    //   .catch((error) => res.json(error));
  

 // Accept friend --> /:username/acceptFriend/:idPerson
router.post("/:username/acceptFriend/:idPerson", (req, res, next) => {
  const username = req.params.username
  const idPerson = req.params.idPerson
  const promUser = User.findOne({"username": username})
  const promPerson = User.findById(idPerson)
  Promise.all([promUser, promPerson])
  .then(resp => {
    let indexIdPerson = resp[0].friendsToAccept.indexOf(idPerson) //ojo! string o idObject
    resp[0].friendsToAccept.splice(indexIdPerson, 1)
    resp[0].friends.push(idPerson)

    let indexUsernameId = resp[1].friendsRequested.indexOf(resp[0]._id) //ojo! string o idObject
    resp[1].friendsRequested.splice(indexUsernameId, 1)
    resp[1].friends.push(resp[0]._id)

    const promUserUpdate = User.findByIdAndUpdate(resp[0]._id , resp[0], {new:true})
    const promPersonUpdate = User.findByIdAndUpdate(idPerson , resp[1], {new:true})
    Promise.all([promUserUpdate, promPersonUpdate])
    .then(resp => {
      res.json(resp)
    })
    .catch((error) => res.json(error));
  })
  .catch((error) => res.json(error));  
  })

//     .then((result) => {
//       // let usernameId = result._id
//       let indexIdPerson = result.friendsToAccept.indexOf(idPerson) //ojo! string o idObject
//       result.friendsToAccept.splice(indexIdPerson, 1)
//       result.friends.push(idPerson)
      
//       User.findById(idPerson)
//           .then((result) => {
//           let indexUsernameId = result.friendsRequested.indexOf(usernameId) //ojo! string o idObject
//           result.friendsRequested.splice(indexUsernameId, 1)
//           result.friends.push(usernameId)
//           res.json("Friend Accepted succesfully");
//       })
//           .catch((error) => res.json(error));
//     })
//     .catch((error) => res.json(error));
// }); 


 // Decline friend --> /:username/declineFriend/:idPerson
 router.post("/:username/declineFriend/:idPerson", (req, res, next) => {
  const username = req.params.username
  const idPerson = req.params.idPerson
  const promUser = User.findOne({"username": username})
  const promPerson = User.findById(idPerson)
  Promise.all([promUser, promPerson])
  .then(resp => {
    let indexIdPerson = resp[0].friendsToAccept.indexOf(idPerson) //ojo! string o idObject
    resp[0].friendsToAccept.splice(indexIdPerson, 1)

    let indexUsernameId = resp[1].friendsRequested.indexOf(resp[0]._id) //ojo! string o idObject
    resp[1].friendsRequested.splice(indexUsernameId, 1)

    const promUserUpdate = User.findByIdAndUpdate(resp[0]._id , resp[0], {new:true})
    const promPersonUpdate = User.findByIdAndUpdate(idPerson , resp[1], {new:true})
    Promise.all([promUserUpdate, promPersonUpdate])
    .then(resp => {
      res.json(resp)
    })
    .catch((error) => res.json(error));
  })
  .catch((error) => res.json(error));  
  })

//  router.post("/denyFriend/:idPerson", (req, res, next) => {
//   const username = req.params.username
//   const idPerson = req.params.idPerson
//   User.findOne({"username": username})
//     .then((result) => {
//       let usernameId = result._id
//       let indexIdPerson = result.friendsToAccept.indexOf(idPerson) //ojo! string o idObject
//       result.friendsToAccept.splice(indexIdPerson, 1)
      
//       User.findById(idPerson)
//           .then((result) => {
//           let indexUsernameId = result.friendsRequested.indexOf(usernameId) //ojo! string o idObject
//           result.friendsRequested.splice(indexUsernameId, 1)
//           res.json("Friend Denied succesfully");
//       })
//           .catch((error) => res.json(error));
//     })
//     .catch((error) => res.json(error));
// }); 

module.exports = router;