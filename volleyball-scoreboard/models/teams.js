const { response } = require('express');
const db = require('../routes/db');

async function addTeam(teamName, players){
    const query = 'INSERT INTO teams (name, players) VALUES ($1, $2)'
    try{
        await db.none(query, [teamName, players]);
        return { status: 200, message: 'Team added' };
    }catch(error){
        console.error('Error in creating team ', error);
        return { status: 500, message: 'Error in addint team' };
    }
}

async function getAllTeams(){
    const query = 'SELECT * FROM teams';
    const result = await db.any(query);
    return result;
}

async function getTeamById(id){
    const query = "SELECT * FROM teams WHERE id = $1";
    const result = await db.oneOrNone(query, [id]);
    return result;
};

module.exports ={
    addTeam,
    getAllTeams,
    getTeamById
}