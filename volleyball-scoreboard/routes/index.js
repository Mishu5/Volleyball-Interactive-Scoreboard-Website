var express = require('express');
var router = express.Router();
const pool = require('./db');

/* GET home page. */
router.get('/', async (req, res) => {


  res.render('index', { matches });
});

module.exports = router;
