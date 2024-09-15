var express = require('express');
var router = express.Router();
const { addMatch, getMatchById, startMatch, updateScore, endSet, swapTeams, endMatch } = require('../models/match');
const { getAllTeams, getTeamById } = require('../models/teams');

router.post('/addMatch', async(req, res)=>{
    if(req.session.userRole && req.session.userRole !== "referee"){
        return res.status(401).json({message: "Unautorized"});
    }
    const {teamA, teamB} = req.body;
    await addMatch(teamA, teamB);
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
        return res.redirect('/');  
    }
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
            await startMatch(matchId);
        }
        await updateScore(matchId, setScore);
        match = await getMatchById(matchId);
        teamA = await getTeamById(match.teama_id);
        teamB = await getTeamById(match.teamb_id);
        global.io.emit('scoreUpdate', {match: match, teamA: teamA, teamB: teamB});
        return res.status(200).json({success: true});
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }

});

router.post('/:id/add-score-to-details', async(req, res)=>{
    const matchId = req.params.id;

    try{

        let match = await getMatchById(matchId);
        const result = match.result;
        let resultDetailed = match.resultdetailed || {results:[]};
        resultDetailed.results.push(result);
        await endSet(matchId, resultDetailed);
        match = await getMatchById(matchId);
        teamA = await getTeamById(match.teama_id);
        teamB = await getTeamById(match.teamb_id);
        global.io.emit('scoreUpdate', {match: match, teamA: teamA, teamB: teamB});
        return res.status(200).json({success: true});
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.post('/:id/swap-teams', async(req, res)=>{
    const matchId = req.params.id;

    try{

        let match = await getMatchById(matchId);
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

        await swapTeams(matchId, teamB, teamA, result, resultDetailed);
        match = await getMatchById(matchId);
        teamA = await getTeamById(match.teama_id);
        teamB = await getTeamById(match.teamb_id);
        global.io.emit('scoreUpdate', {match: match, teamA: teamA, teamB: teamB});
        return res.status(200).json({success: true});
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal server error"});
    }

});

router.post("/:id/end-match", async(req, res)=>{
    const matchId = req.params.id;

    try{

        await endMatch(matchId);
        global.io.emit('finished', {id: matchId});
        return res.status(200).json({success: true});
        
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Intenal server error"});
    }
});

module.exports = router;