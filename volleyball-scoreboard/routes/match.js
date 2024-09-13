var express = require('express');
var router = express.Router();
const io = require('../app').io;
const { addMatch, getMatchById } = require('../models/match');

router.post('/addMatch', async(req, res)=>{
    if(req.session.userRole && req.session.userRole !== "referee"){
        return res.status(401).json({message: "Unautorize"});
    }
    const {teamA, teamB} = req.body;
    addMatch(teamA, teamB);
});

router.get('/:id', async(req, res) =>{

    const match = getMatchById(id);

    res.render('match', {match: match});
})

module.exports = router;