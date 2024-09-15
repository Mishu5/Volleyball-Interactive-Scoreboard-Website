var express = require('express');
var router = express.Router();
const Match = require('../models/match');
const { getAllTeams, getTeamById } = require('../models/teams');

/* GET home page. */
router.get('/', async (req, res) => {
  const status = req.query.status;
  const matches = await Match.getMatches(status);
  const teams = await getAllTeams();
  const teamMap = teams.reduce((map, team) => {
    map[team.id] = team.name;
    return map;
  }, {});
  const matchesWithTeams = matches.map(match => ({
    ...match,
    teamAName: teamMap[match.teama_id],
    teamBName: teamMap[match.teamb_id]
  }));
  res.render('index', {matches: matchesWithTeams });
});

router.post('/delete/:id', async (req, res) => {
  await Match.deleteMatch(req.params.id);
  io.emit('matchDeleted', {matchId: req.params.id});
  res.redirect('/index');
});

router.get('/copy/:id', async (req, res) => {
  const match = await Match.getMatchById(req.params.id);
  const teamA = await getTeamById(match.teama_id);
  const teamB = await getTeamById(match.teamb_id);
  
  const results = match.resultdetailed.results || [];
  const numberOfSets = results.length;


  const headers = Array.from({ length: numberOfSets }, (_, i) => `S${i + 1}`).join(' | ');
  

  const teamAScores = results.map(result => result.split(':')[0]).join(' | ');
  const teamBScores = results.map(result => result.split(':')[1]).join(' | ');


  const teamATotal = results.reduce((total, result) => total + parseInt(result.split(':')[0]), 0);
  const teamBTotal = results.reduce((total, result) => total + parseInt(result.split(':')[1]), 0);

  const result = `
Teams  ${headers} | Total
${teamA.name}:  ${teamAScores} | ${teamATotal}
${teamB.name}:  ${teamBScores} | ${teamBTotal}
${new Date(match.date).toISOString().slice(0, 16).replace('T', ' ')}
  `;

  return res.send(result);
});

module.exports = router;
