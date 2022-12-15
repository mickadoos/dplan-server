const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    profileImage: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendsRequested: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendsToAccept: [{ type: Schema.Types.ObjectId, ref: "User" }],

    plans: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Plan" },
        status: {
          type: String,
          enum: ["confirmed", "declined", "pending", "admin"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
