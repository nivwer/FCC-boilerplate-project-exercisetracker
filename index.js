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

app.post('/api/users/:_id/exercises', async (req, res) => {

  const createExercise = async (id, username, des, dur, date) => {
    const exercise = new Exercise({
      user_id: id,
      username: username,
      description: des,
      duration: dur,
      date: date ? new Date(date) : new Date()
    });
    await exercise.save();
    return exercise;
  };

  const user = await User.findById(req.params._id);
  if (user) {
    const { description, duration, date } = req.body;
    createExercise(user._id, user.username, description, duration, date)
      .then(exercise => res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      }))
      .catch(err => console.log(err));
  } else {
    res.send('User not found')
  }

});


app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const id = req.params._id;
  const user = await User.findById(id);

  const filter = {
    user_id: id,
    ...(from && { date: { $gte: new Date(from) } }),
    ...(to && { date: { $lte: new Date(to) } }),
  };

  const exercises = await Exercise.find(filter).limit(+limit || 500).exec();

  if (exercises.length === 0) {
    res.send("Could not find user");
    return;
  }

  const log = exercises.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log: log
  });
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
