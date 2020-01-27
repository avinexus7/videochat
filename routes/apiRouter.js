var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.statusCode(200).send('this is api core get');
});

module.exports = router;
