const { Schema, model } = require("mongoose");

const planSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    planImage: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
    },
    latitud: { type: Number },
    longitud: { type: Number },
    tags: [{ type: String }],

    isAdmin: {
      type: String,
    },

    musicList: {
      type: String,
    },

    photoCloud: {
      type: String,
    },

    interestingLinks: {
      type: String,
    },

    // Arrays Party Fiesta
    invited: [{ type: Schema.Types.ObjectId, ref: "User" }],
    accepted: [{ type: Schema.Types.ObjectId, ref: "User" }],
    declined: [{ type: Schema.Types.ObjectId, ref: "User" }],

    polls: [
      {
        pollQuestion: { type: String },
        pollAnswers: [
          {
            text: { type: String },
            votes: { type: Number },
          },
        ],
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "private"],
    },
  },
  {
    timestamps: true,
  }
);

const Plan = model("Plan", planSchema);

module.exports = Plan;
