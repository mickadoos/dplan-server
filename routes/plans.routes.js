const express = require("express");
const User = require("../models/User.model");
const Plan = require("../models/Plan.model");
const router = express.Router();

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');
const { default: mongoose } = require("mongoose");

var ObjectID = require('mongodb').ObjectId;


router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Create new plan --> /api/plans/:username/newPlan
router.post("/:username/newPlan", fileUploader.single('planImage'), (req, res, next) => {
  let username = req.params.username
  // const { title, description, image, date, time, location, tags } = req.body;
  const { title, description, planImage, date, time, location } = req.body;
  const promNewPlan = Plan.create({ title, description, planImage: req.file.path, date, time, location, isAdmin:username})
  const promUser = User.findOne({"username" : username})
  Promise.all([promNewPlan, promUser])
  .then(resp => {
    resp[1].plans.push({"_id": resp[0]._id.toString(), "status":"admin"})
    User.findByIdAndUpdate(resp[1]._id, resp[1], {new: true})
    .then(resp => {
      res.json(resp)
    })
    .catch((error) => {
      res.json(error)});
  })
  // res.json(req.body);
});

// Plan Page --> /api/plans/:planId
router.get("/:planId", (req, res, next) => {
  Plan.findOne({"_id": req.params.planId})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Plan Edit --> /api/plans/:planId
router.put("/:planId", fileUploader.single("planImage"), (req, res, next) => {
  
  const { title, description, date, time, location} = req.body;

  Plan.findByIdAndUpdate(req.params.planId, (req.file? { "planImage": req.file.path} : req.body ), {new: true})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Plan Delete --> /api/plans/:planId
router.delete("/:planId", (req, res, next) => {

//It would be a nice idea to update the plans array accessing through the planId populate
 User.updateMany({}, { $pull: { plans: {_id : req.params.planId } } })
  .then((result) => {
  })
  .catch((error) => res.json(error));

  Plan.findByIdAndDelete(req.params.planId)
  .then(result => {
    res.json("Plan deleted succesfully!")
  })
  .catch(error => res.json (error))
})

// Plan Guests --> /api/plans/:planId/guests
router.get("/:planId/guests", (req, res, next) => {
  Plan.findById(req.params.planId)
    .populate("invited")
    .populate("accepted")
    .populate("declined")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Invite guests to a plan (list of friends) --> /api/plans/:planId/:username/invite
router.get("/:planId/:username/invite", (req, res, next) => {
  let username = req.params.username
  User.findOne({"username" : username})
    .populate("friends")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Invite guests to a plan (invite) --> /api/plans/:planId/:idPerson/invite
router.post("/:planId/:idPerson/invite", (req, res, next) => {
  console.log("INVITE - POST. IdPerson/IdPlan: ", req.params.idPerson, req.params.planId)
  let idPerson = req.params.idPerson
  let planId = req.params.planId
  let promUser = User.findById(idPerson)
  let promPlan = Plan.findById(planId)
  Promise.all([promUser, promPlan])
  .then(resp => {
    resp[0].plans.push({"_id": planId, "status": "pending"})
    // resp[0].plans[resp[0].plans.length-1].status = "pending"
    resp[1].invited.push(idPerson)
    let promUserUpdated = User.findByIdAndUpdate(idPerson, resp[0], {new: true})
    let promPlanUpdated = Plan.findByIdAndUpdate(planId, resp[1], {new: true})
    return Promise.all([promUserUpdated, promPlanUpdated])
  })   
  .then(resp => {
    res.json(resp)
  })
  .catch((error) => res.json(error));
});

// Accept Plan --> /api/plans/:planId/:username/accept
router.post("/:planId/:username/accept", (req, res, next) => {

  const promUser = User.findOne({ username: req.params.username });
  const promPlan = Plan.findById(req.params.planId);

  Promise.all([promUser, promPlan])
    .then((resp) => {
      const plansUpdated = resp[0].plans.map((plan) => {
        if (plan._id.toString() == req.params.planId) {
          plan.status = "confirmed";
        }
        return plan;
      });

      let indexUser = resp[1].invited.indexOf(resp[0]._id);
      resp[1].invited.splice(indexUser, 1);
      resp[1].accepted.push(resp[0]._id);

      const promUser2 = User.findByIdAndUpdate(
        resp[0]._id,
        { plans: plansUpdated },
        { new: true }
      );
      const promPlan2 = Plan.findByIdAndUpdate(req.params.planId, resp[1], {
        new: true,
      });
      return Promise.all([promUser2, promPlan2]);
    })
    .then((resp) => {
      console.log("Plan Accepted Succesfully: ", resp)
      res.json(resp);
    })
  .catch((error) => res.json(error));

});

// Decline Plan --> /api/plans/:planId/:username/decline
router.post("/:planId/:username/decline", (req, res, next) => {

  const promUser = User.findOne({ "username": req.params.username });
  const promPlan = Plan.findById(req.params.planId);
  
  Promise.all([promUser, promPlan])
    .then((resp) => {
      const plansUpdated = resp[0].plans.map((plan) => {
        if (plan._id.toString() == req.params.planId) {
          plan.status = "declined";
        }
        return plan;
      });

      let indexUser = resp[1].invited.indexOf(resp[0]._id);
      resp[1].invited.splice(indexUser, 1);
      resp[1].declined.push(resp[0]._id);

      const promUser2 = User.findByIdAndUpdate(
        resp[0]._id,
        { plans: plansUpdated },
        { new: true }
      );
      const promPlan2 = Plan.findByIdAndUpdate(req.params.planId, resp[1], {
        new: true,
      });
      return Promise.all([promUser2, promPlan2]);
    })
    .then((resp) => {
      console.log("Plan Declined Succesfully: ", resp)
      res.json(resp);
    })
  .catch((error) => res.json(error));

});

module.exports = router;
