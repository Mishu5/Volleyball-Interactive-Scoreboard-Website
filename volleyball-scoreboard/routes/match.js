var express = require('express');
var router = express.Router();
const io = require('../app').io;
const { addMatch, getMatchById, startMatch, updateScore, endSet, swapTeams, endMatch } = require('../models/match');
const { getAllTeams, getTeamById } = require('../models/teams');

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
    if(!match){
        return res.status(404);    }
    const teamA = await getTeamById(match.teama_id);
    const teamB = await getTeamById(match.teamb_id);

    res.render('match', {match: match, teamA: teamA, teamB: teamB});
});

router.post('/:id/update-score', async(req, res)=>{

    const matchId = req.params.id;
    const { setScore } = req.body;
    
    try{

        let match = await getMatchById(matchId);
        if(match.status === "PLANNED"){
            startMatch(matchId);
        }
        updateScore(matchId, setScore);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }

});

router.post('/:id/add-score-to-details', async(req, res)=>{
    const matchId = req.params.id;

    try{

        let match = getMatchById(matchId);
        const result = match.result;
        let resultDetailed = match.resultdetailed || {results:[]};
        resultDetailed.results.push(result);
        endSet(matchId, resultDetailed);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.post('/:id/swap-teams', async(req, res)=>{
    const matchId = req.params.id;

    try{

        const match = getMatchById(matchId);
        let result = match.result;
        let resultDetailed = match.resultdetailed || {results :[]};
        let teamA = match.teama_id;
        let teamB = match.teamb_id;

        const parts = result.split(':');
        result = `${parts[1]}:${parts[0]}`;

        resultDetailed.results = resultDetailed.results.map((set)=>{
            const [teamAScore, teamBScore] = set.split(':');
            return `${teamBScore}:${teamAScore}`;
        });

        swapTeams(matchId, teamB, teamA, result, resultDetailed);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }

});

router.post("/:id/end-match", async(req, res)=>{
    const matchId = req.params.id;

    try{

        endMatch(matchId);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Intenal server error"});
    }
});

module.exports = router;