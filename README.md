# DPlan - Backend

Developed as the final project of our web development bootcamp at Ironhack Barcelona, this is Yabel, Eloi and Josep’s MERN Stack application. Check the frontend repository [here](https://github.com/PmplCode/DPlan-front).

## About

DPlan is a Full Stack application meant to help users plannify their private events such as parties or social meetings in a simple way. 
Create, share, experience and organize events quickly, easily and fun.

## Deployment

You can check the app fully deployed [here]( https://famous-brioche-240d75.netlify.app).


## Installation guide

- Fork this repo
- Clone this repo

```shell
$ cd DPlan-back
$ npm install
$ npm start


## Models
#### User.model.js
```js
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
      // required: [true, "Name is required."],
    },
    username: {
      type: String,
      // required: true,
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
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);
```

#### Plan.model.js
```js
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
```


## API Reference

| METHOD | ENDPOINT  | RESPONSE(200)| ACTION |
| :------------ |:---------------:| :-----:|-----:|
| POST   | /auth/login | res.status(200).json({ authToken: authToken })| Send the token as the response.|
| POST   | /auth/signup | res.status(201).json({ user: user }) |Creates a new user in the database. |
| GET    | /auth/verify |    res.status(200).json(req.payload); | Send back the token payload object containing the user data. |
| POST   | /:username/newPlan | res.json(resp)| Create a new plan. |
| GET    | /:planId      | res.json(result) | View plan details. |
| PUT    | /:planId     | res.json(result) | Edit the plan. |
| DELETE | /:planId | res.json("Plan deleted succesfully!")) | Delete the plan. |
| GET    | /:planId/guests | res.json(result) | View people invited to the plan. |
| GET    | /:planId/:username/invite | res.json(result) | View people user can invite to the plan. |
| POST   | /:planId/:username/invite | res.json(resp) | Invite people to the plan. |
| POST   | /:planId/:username/accept      | res.json(resp) | Accept invitation to the plan. |
| POST   | /:planId/:username/decline | res.json(resp) | Decline invitation to the plan. |
| GET    | /:username | res.json(result) | View current user plans. |
| GET    | /:username/profile | res.json(result) | View :username profile |
| PUT    | /:username/edit | res.json(authToken) | Edit current user profile. |
| GET    | /:username/friends | res.json(result) | View :username friends. |
| GET    | /:username/addFriends | res.json(result) | View users in the app you can request friendship to. |
| POST   | /:username/friendRequest/:idPerson | res.json(resp) | Request friendship. |
| POST   | /:username/acceptFriend/:idPerson | res.json(resp) | Accept friendship. |
| POST   | /:username/declineFriend/:idPerson | res.json(resp) | Decline friendship. |



---

Any doubts? Contact us!

<br>
<img width="20px" src="https://simpleicons.now.sh/linkedin/495f7e" alt="LinkedIn" />
</br>

<a href="https://www.linkedin.com/in/josepbp/">Josep</a>
<a href="https://www.linkedin.com/in/eloipampliegajose/">Eloi</a>
<a href="http://www.linkedin.com/in/yabel-rodriguez">Yabel</a>
