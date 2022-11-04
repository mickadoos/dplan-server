const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    image : {
        type: String,
        default: "https://picsum.photos/300"
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    tags: [{type: String}],

    // Arrays Party Fiesta
    invited: [[{type: Schema.Types.ObjectId, ref: "User"}]],
    accepted: [[{type: Schema.Types.ObjectId, ref: "User"}]],
    denied: [[{type: Schema.Types.ObjectId, ref: "User"}]]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Plan = model("Plan", planSchema);

module.exports = Plan;