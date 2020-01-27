var express = require('express')
var app = express()
var router = express.Router()
var apiRouter = require('./apiRouter')

app.use('/api', apiRouter)

router.get('/home', (req, res, next) => {
  res.render('home', { title: 'Home' })
})

router.get('/videochat', (req, res, next) => {
  res.render('videoChat', { title: 'videochat' })
})

router.get('/supporter', (req, res, next) => {
  res.render('supporter', { title: 'supporter' })
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/home')
  // res.render('index', { title: 'asdf' })
})

module.exports = router
