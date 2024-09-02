var express = require('express');
var router = express.Router();
const pool = require('./db');

/* GET home page. */
router.get('/', async function(req, res, next) {

  try {
    const result = await pool.query('SELECT * FROM uzytkownicy');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

  res.render('index', { title: 'Express' });
});

module.exports = router;
