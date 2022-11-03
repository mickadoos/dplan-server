const express = require("express");
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


module.exports = router;
