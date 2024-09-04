var express = require('express');
var router = express.Router();
const Match = require('../models/match');
const io = require('../app').io;

/* GET home page. */
router.get('/', async (req, res) => {
  const status = req.query.status;
  const matches = await Match.getMatches(status);
  res.render('index', { matches });
});

router.post('/delet/:id', async (req, res) => {
  await Match.deleteMatch(req.params.id);
  io.emit('matchDeleted', {matchId: req.params.id});
  res.redirect('/index');
});


router.get('/view/:id', async (req, res) => {
  const match = await Match.getMatchById(req.params.id);
  res.render(viewMatch, {match});
})

router.get('/copy/:id', async (req, res) => {
  const match = await Match.getMatchById(req.params.id);
  const resultDetailed = match.resultdetailed.map(set => set.join(' | ')).join('\n');
  const result = `
S1 | S2 | S3 | S4 | Total
${match.teamA} ${resultDetailed} ${match.score[0]}
${match.teamB} ${resultDetailed} ${match.score[1]}
${new Date(match.date).toISOString().slice(0, 16).replace('T', ' ')}
  `;
  res.send(result);
});

//TODO add updating status

module.exports = router;
