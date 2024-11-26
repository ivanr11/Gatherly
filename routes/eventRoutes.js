const express = require('express')
const controller = require('../controllers/eventController')
const { fileUpload } = require('../middleware/fileUpload')
const { isLoggedIn, isHost } = require('../middleware/auth')
const {
  validateId,
  validateEvent,
  validateResult,
} = require('../middleware/validator')

const eventRouter = express.Router()

//GET /events: send all event to the user
eventRouter.get('/', controller.index)

//GET /events/new: send html form for creating a new event
eventRouter.get('/new', isLoggedIn, controller.new)

//POST /events: create a new event
eventRouter.post(
  '/',
  fileUpload,
  isLoggedIn,
  validateEvent,
  validateResult,
  controller.create
)

//GET /events/:id: send details of event identified by id
eventRouter.get('/:id', validateId, controller.show)

eventRouter.post('/:id/rsvp', isLoggedIn, controller.createRsvp)

//GET /events/:id/edit: send html form for editing an exising event
eventRouter.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit)

//PUT /events/:id: update the event identified by id
eventRouter.put(
  '/:id',
  validateId,
  isLoggedIn,
  isHost,
  validateEvent,
  validateResult,
  controller.update
)

//DELETE /events/:id, delete the event identified by id
eventRouter.delete('/:id', validateId, isLoggedIn, isHost, controller.delete)

module.exports = eventRouter
