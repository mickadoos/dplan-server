const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan.model");

router.get("/plans", (req, res, next) => {
  Plan.find().then((resp) => {
    res.json(resp);
  });
});

router.post("/", (req, res, next) => {
  res.json(req.body);
});

module.exports = router;
