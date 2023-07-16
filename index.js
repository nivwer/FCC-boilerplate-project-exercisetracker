const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./connection');

const User = require("./models/Users");
const Exercise = require("./models/Exercise");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const createUser = async (username) => {
    const user = new User({
      username: username,
    });
    await user.save();
    return user;
  };

  createUser(req.body.username)
    .then(user => res.json({
        username: user.username,
        _id: user._id,
      }))
    .catch(err => console.log(err))
});

app.get('/api/users', (req, res) => {
  const findUsers = async () => {
    const usersFound = await User.find({}, 'username _id');
    return usersFound
  }

  findUsers()
    .then(usersFound => res.json(usersFound))
    .catch(err => console.log(err))
  
}) 



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
