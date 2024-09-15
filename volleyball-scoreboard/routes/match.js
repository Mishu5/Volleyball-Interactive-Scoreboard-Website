var express = require('express');
var router = express.Router();
const io = require('../app').io;
const { addMatch, getMatchById } = require('../models/match');
const { getAllTeams } = require('../models/teams');

router.post('/addMatch', async(req, res)=>{
    if(req.session.userRole && req.session.userRole !== "referee"){
        return res.status(401).json({message: "Unautorize"});
    }
    const {teamA, teamB} = req.body;
    addMatch(teamA, teamB);
    res.redirect('/');
});

router.get('/add', async(req, res)=>{
    const teams = await getAllTeams();
    res.render('addMatch', {teams: teams});
});

router.get('/:id', async(req, res) =>{
    const { id } = req.params;
    const match = await getMatchById(id);

    res.render('match', {match: match});
});

module.exports = router;