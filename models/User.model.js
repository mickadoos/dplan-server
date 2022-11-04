const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    birthdate: {
      type: String,
    },
    gender: {
      enum: ["male", "female", "other"],
    },
    profileImage: {
      type: String,
      default: "https://picsum.photos/300",
    },
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },

    // Arrays Party Fiesta

    //Friends
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendsRequested: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendsToAccept: [{ type: Schema.Types.ObjectId, ref: "User" }],

    //Plans
    plans: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        status: { enum: ["confirmed", "declined", "pending", "admin"] },
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
