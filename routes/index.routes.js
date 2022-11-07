const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan.model");


router.get("/plans", (req, res, next) => {
  res.json("All good in here");
});

router.post("/", (req, res, next) => {
  res.json(req.body);
});

module.exports = router;

