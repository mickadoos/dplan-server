const express = require("express");
const User = require("../models/User.model");
const Plan = require("../models/Plan.model");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Create new plan --> /api/plans/newPlan
router.post("/newPlan", (req, res, next) => {
  const { title, description, image, date, time, location, tags } = req.body;
  res.json(req.body);
});

// Plan Page --> /api/plans/:planId
router.get("/:planId", (req, res, next) => {
  Plan.findOne(req.params.planId)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Plan Edit --> /api/plans/:planId
router.put("/:planId", (req, res, next) => {
  const { title, description, image, date, time, location, tags } = req.body;
  Plan.findByIdAndUpdate(req.params.planId, req.body, returnNewDocument)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json(error));
});

// Plan Guests --> /api/plans/:planId/guests
router.get("/:planId/guests", (req, res, next) => {
  Plan.findById(req.params.planId)
    .populate("invited")
    .populate("accepted")
    .populate("denied")
    .then((result) => {
      res.json(result);
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
        if (plan._id === req.params.planId) {
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
      res.json("Plan Accepted Succesfully: ", resp);
    })
  .catch((error) => res.json(error));

});

// Decline Plan --> /api/plans/:planId/:username/decline
router.post("/:planId/:username/decline", (req, res, next) => {

  const promUser = User.findOne({ username: req.params.username });
  const promPlan = Plan.findById(req.params.planId);
  
  Promise.all([promUser, promPlan])
    .then((resp) => {
      const plansUpdated = resp[0].plans.map((plan) => {
        if (plan._id === req.params.planId) {
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
      res.json("Plan Declined Succesfully: ", resp);
    })
  .catch((error) => res.json(error));

});

module.exports = router;
