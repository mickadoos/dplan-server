const { Schema, model } = require("mongoose");

const planSchema = new Schema(
  {
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    planImage : {
        type: String,
        // default: "https://picsum.photos/300"
    },
    date: {
        type: String,
        // required: true
    },
    time: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    tags: [{type: String}],
    
    isAdmin : {
      type: String
    },

    musicList: {
      type: String,
      // required: true
    },

    photoCloud: {
      type: String,
      // required: true
    },

    interestingLinks: {
      type: String,
      // required: true
    },

    invited: [{type: Schema.Types.ObjectId, ref: "User"}],
    accepted: [{type: Schema.Types.ObjectId, ref: "User"}],
    declined: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timestamps: true,
  }
);

const Plan = model("Plan", planSchema);

module.exports = Plan;