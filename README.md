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
      // required: [true, "Name is required."],
    },
    username: {
      type: String,
      // required: true,
      unique: true,
      trim: true
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    profileImage: {
      type: String,
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
    invited: [[{type: Schema.Types.ObjectId, ref: "User"}]],
    accepted: [[{type: Schema.Types.ObjectId, ref: "User"}]],
    denied: [[{type: Schema.Types.ObjectId, ref: "User"}]],

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
|POST|	/auth/signup|	|user.create|	Sign Up|
|POST	|/auth/login|	|authToken|	Login|
|GET|	/users/:username|	|OBJCT --> User.populate("plans")	|Find ALL plans of the user|
|POST|	/plans/newPlan|	|plan.create|	Create new plan|
|GET	|/plans/:planId|	|OBJCT --> Plan|	Find ONE plan of the user|
|POST	|/plans/:planId/:username/accept|	|:username.findOneAndUpdate // yes->status=confirmed	|Accept invitation to a plan|
|POST|	/plans/:planId/:username/decline|	|:username.findOneAndUpdate // no->status=declined|	Decline invitation to a plan|
|POST|	/plans/:planId/accept|	|:username.findOneAndUpdate // yes->status=confirmed & no->status=declined	|Accept or not invitation to a plan|
|PUT|	/plans/:planId|	|OBJCT --> Plan (edited)	|Edit plan|
|GET|	/plans/:planId/invite|	||	View friends ti invite to a plan|
|POST|	/plans/:planId/invite	|	|| Invite friends to a plan|
|GET|	/plans/:planId/guests|	|OBJCT --> User.populate("invited","accepted","denied")|	List of ALL guests invited to a plan |
|GET|	/:username/profile|	|OBJCT --> User.populate(friendsToAccept)	|User info for profile|
|PUT|	/:username/edit|	|OBJCT --> User (edited)|	Edit user info|
|GET|	/:username/friends|	|OBJCT --> User.populate(friends)|	User friends|
|GET|	/:username/addFriends|	|ARRAY OBJCTS [.find(!friends)]	|Show all Dplan users (except friends)|
|POST|	/:username/friendRequest/:idPerson|	|:username.findOneAndUpdate // friendsRequested.push(:idPerson)	|Send friend request|
|		| | |:idPerson.findOneAndUpdate // friendsToAccept.push(:username)| |	
|POST|	/:username/acceptFriend/:idPerson|	|:username.findOneAndUpdate // friends.push(:idPerson) & friendsToAccept.pop(:idPerson)|	Accept friend requests|
|		| | |:idPerson.findOneAndUpdate // friends.push(:username) & friendsRequested.pop(:username)|	|
|POST|	/:username/denyFriend/:idPerson|	|:username.findOneAndUpdate // friendsToAccept.pop(:idPerson)|	Deny friend requests|
|		| | |:idPerson.findOneAndUpdate // friendsRequested.pop(:username)| |	
|POST	|/:username/acceptFriend/:idPerson|	|:username.findOneAndUpdate // friends.push(:idPerson) & friendsToAccept.pop(:idPerson)|	Accept friend requests|
|		|	| |:idPerson.findOneAndUpdate // friends.push(:username) & friendsRequested.pop(:username)| |
|POST	|/:username/declineFriend/:idPerson|	|:username.findOneAndUpdate // friendsToAccept.pop(:idPerson)|	|Decline friend requests|
|		|	| |:idPerson.findOneAndUpdate // friendsRequested.pop(:username)| |




Welcome to the Olympus.

