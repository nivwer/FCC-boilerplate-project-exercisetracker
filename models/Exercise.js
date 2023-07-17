const { Schema, model } = require('mongoose')

const exerciseSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now
  },
  user_id: String
})

module.exports = model('Exercise', exerciseSchema);