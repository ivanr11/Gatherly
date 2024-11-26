const res = require("express/lib/response");
const model = require("../models/event");
const rsvpModel = require("../models/rsvp");
const { DateTime } = require("luxon");
const { promise } = require("bcrypt/promises");

//GET /events: send all events to the user
exports.index = (req, res, next) => {
  model
    .find()
    .then((events) => res.render("./event/events", { events }))
    .catch((err) => next(err));
};

//GET /events/new: send form for creating new event
exports.new = (req, res) => {
  res.render("./event/newEvent");
};

//POST /events: create a new event
exports.create = (req, res, next) => {
  let event = new model(req.body); //create a new event document
  let image = "./uploads/" + req.file.filename;
  event.host = req.session.user;
  let start = new Date(req.body.start);
  // let end = new Date(req.body.end)

  event.startDate = DateTime.fromJSDate(start);
  // event.endDate = DateTime.fromJSDate(end)
  event.image = image;
  event
    .save()
    .then((event) => res.redirect("/events"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//GET /events/:id: show event with specified id
exports.show = (req, res, next) => {
  let id = req.params.id;

  Promise.all([
    model.findById(id).populate("host", "firstName lastName"),
    rsvpModel.countDocuments({ event: id, status: "YES" }),
  ])
    .then((results) => {
      const [event, rsvpCount] = results;
      if (event) {
        return res.render("./event/event", { event, rsvpCount });
      } else {
        let err = new Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//GET /events/:id/edit: send html form to edit event identified by id
exports.edit = (req, res, next) => {
  let id = req.params.id;

  model
    .findById(id)
    .then((event) => {
      return res.render("./event/edit", { event });
    })
    .catch((err) => next(err));
};

//PUT /events/:id/edit: update the event identified by id
exports.update = (req, res, next) => {
  let event = req.body;
  let id = req.params.id;

  model
    .findByIdAndUpdate(id, event, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((event) => {
      res.redirect("/events/" + id);
    })
    .catch((err) => {
      if (err.name === "ValidationError") err.status = 400;
      next(err);
    });
};

//DELETE /events/:id: delete the event identified by id
exports.delete = (req, res, next) => {
  let id = req.params.id;
  Promise.all([
    model.findByIdAndDelete(id, { useFindAndModify: false }),
    rsvpModel.deleteMany({ event: id }),
  ])
    // model
    //   .findByIdAndDelete(id, { useFindAndModify: false })
    .then((event) => {
      res.redirect("/events");
    })
    .catch((err) => next(err));
};

//POST /events/:id/rsvp
exports.createRsvp = (req, res, next) => {
  let id = req.params.id;
  let status = req.body.rsvpStatus;
  let user = req.session.user;
  let rsvp = { event: id, user: user, status: status };

  rsvpModel
    .findOneAndUpdate({ event: id, user: user }, rsvp, {
      new: true,
      upsert: true,
      rawResult: true,
    })
    .then((result) => {
      return res.redirect("/users/profile");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};
