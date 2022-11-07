const express = require("express");
const User = require("../models/User.model");
const router = express.Router();

// User plans Page --> /:username
router.get("/:username", (req, res, next) => {
  User.findOne({"username":req.params.username})
  .populate ("plans")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Profile Page --> /:username/profile
router.get("/:username/profile", (req, res, next) => {
    User.findOne({"username":req.params.username})
    .populate ("friendsToAccept")
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.json(error));
  });

// Profile Page, edit --> /:username/edit
router.put("/:username/edit", (req, res, next) => {
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

    const promUser = User.findOne({"username": username})
    const promPerson = User.findById(idPerson)
      Promise.all([promUser, promPerson])
        .then(resp => {
          resp[0].friendsRequested.push(idPerson)
          resp[1].friendsToAccept.push(resp[0]._id)
          const promUserUpdate = User.findByIdAndUpdate(resp[0]._id , resp[0], {new:true})
          const promPersonUpdate = User.findByIdAndUpdate(idPerson , resp[1], {new:true})
          Promise.all([promUserUpdate, promPersonUpdate])
          .then(resp => {
            res.json("Friend requested succesfully: ", resp)
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
      res.json("Friend Accepted succesfully: ", resp)
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
      res.json("Friend Declined succesfully: ", resp)
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