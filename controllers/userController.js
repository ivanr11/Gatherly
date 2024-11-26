const model = require('../models/user')
const rsvpModel = require('../models/rsvp')
const Event = require('../models/event')

exports.new = (req, res) => {
  return res.render('./user/new')
}

exports.create = (req, res, next) => {
  let user = new model(req.body)
  user
    .save()
    .then((user) => {
      req.flash('success', 'Registration succeeded!')
      res.redirect('/users/login')
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        req.flash('error', err.message)
        return res.redirect('/users/new')
      }

      if (err.code === 11000) {
        req.flash('error', 'Email has already been used')
        return res.redirect('/users/new')
      }

      next(err)
    })
}

exports.getUserLogin = (req, res, next) => {
  return res.render('./user/login')
}

exports.login = (req, res, next) => {
  let email = req.body.email
  let password = req.body.password
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log('Wrong email address')
        req.flash('error', 'Wrong email address')
        res.redirect('/users/login')
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id
            req.flash('success', 'You have successfully logged in')
            res.redirect('/users/profile')
          } else {
            req.flash('error', 'Wrong password')
            res.redirect('/users/login')
          }
        })
      }
    })
    .catch((err) => next(err))
}

exports.profile = (req, res, next) => {
  let id = req.session.user
  Promise.all([
    model.findById(id),
    Event.find({ host: id }),
    rsvpModel.find({ user: id }).populate('event', 'title'),
  ])
    .then((results) => {
      const [user, events, userRsvps] = results
      res.render('./user/profile', { user, events, userRsvps })
    })
    .catch((err) => next(err))
}

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err)
    else res.redirect('/')
  })
}