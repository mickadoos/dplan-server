# DPlan-back
Developed by the Olympus Team.
## About
Simplify the way you plan your plans with your friends.
## Deployment
You can check the app fully deployed [here]. If you wish to view the API deployment instead, check [here].

## Work structure
I developed this project alone and used Trello to organize my workflow.
## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd portfolio-front
$ npm install
$ npm start
```
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
      required: [true, "Name is required."],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    birthdate: {
      type: String
    },
    gender: {
      enum: ["male", "female", "other"]
    },
    profileImage: {
      type: String,
      default: "https://picsum.photos/300"
    },
    phoneNumber: {
      type: String
    },
    country: {
      type: String
    },

    // Arrays Party Fiesta

    //Friends
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    friendsRequested: [{type: Schema.Types.ObjectId, ref: "User"}],
    friendsToAccept: [{type: Schema.Types.ObjectId, ref: "User"}],

    //Plans
    plans: [{type: Schema.Types.ObjectId, ref: "Plan", status: {enum: ["confirmed", "declined", "pending", "admin"]}}]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
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
    attendees: [{type: Schema.Types.ObjectId, ref: "User"}]

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
```
## User roles
| Role  | Capabilities                                                                                                                             | Property       |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User  | Can login/logout. Can read all the projects. Can create a new order.                                                                       | isAdmin: false |
| Admin | Can login/logout. Can read, edit or delete all the projects. Can create a new project. Can read all user's orders and edit or delete them. | isAdmin: true  |
## API Reference

| Method |	Endpoint |	Require|	Response (200)|	Action|
| ------ | ------ |  ------ |  ------ |  ------ |
|POST|	/signup	const| { username, email, password } = req.body	json({user: user})||	Registers the user in the database and returns the logged in user. |
|POST	|/login	const |{ email, password } = req.body	json({authToken: authToken})||	Logs in a user already registered.|
|GET|	/plans/:username	|	json({authToken: authToken})||	Returns all the plans from the plans array from the corrent user.|
|GET|	/plan/:planId	|	json({authToken: authToken})||	Returns the plan corresponding with the id.|
|POST	|/new-plan		|json({user: user})	||Creates thes plan in the data base and resturns the plan’s id.|
|PUT|	/plan/:planId/edit	|	json({authToken: authToken})||	Edits the current editing plan and returns the current plan id.|
|DELETE	|/plan/:planId	|	json({authToken: authToken})||	Deletes the current plan and returns “ok”|
|GET|	/plan/:planId/attendees	|	json({authToken: authToken})||	Returns all the users contained in attendees array of the corrent plan.|
|GET	| /username 	|	json({authToken: authToken})||	Returns the current user information from the data base.|
|PUT	| /:username /edit	|	json({authToken: authToken})||	Edits the current user information.|
|GET	| /:username/friends	|	json({authToken: authToken})||	Returns the users of the friends array of the corrent user.|


Welcome to the Olympus.

