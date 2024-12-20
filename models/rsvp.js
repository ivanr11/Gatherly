const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rsvpSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['YES', 'NO', 'MAYBE'],
  },
})

module.exports = mongoose.model('Rsvp', rsvpSchema)
