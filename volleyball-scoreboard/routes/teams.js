var express = require('express');
var router = express.Router();
var { addTeam } = require('../models/teams');

router.get('/add', async (req, res)=>{
    res.render('addTeamForm', {});
});

router.post('/add', async (req, res)=>{
    const {name, players} = req.body;
    try{
        const playersJson = JSON.parse(players);
        await addTeam(name, players);
        res.status(200).json({message: 'Team added'});
    }catch(error){
        res.status(500).json({message: 'Error in adding team'});
    }
});

module.exports = router;