const express = require('express')
const mainRouter = express.Router()

mainRouter.get('/', (req, res) => {
  res.render('index')
})

mainRouter.get('/about', (req, res) => {
  res.render('about')
})

mainRouter.get('/contact', (req, res) => {
  res.render('contact')
})

module.exports = mainRouter
