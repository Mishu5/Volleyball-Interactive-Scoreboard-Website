const db = require('../routes/db');

const getMatches = async (status) => {
    let query = 'SELECT * FROM matches ';
    if(status) {
        query += ' WHERE status = $1 ';
    }
    query += 'ORDER BY date DESC';

    const matches = await db.any(query, status ? [status] :[]);
    return matches;
}

const getMatchById = async (id) => {
    const match = await db.oneOrNone('SELECT * FROM matches WHERE id = $1', [id]);
    return match;
}

const addMatch = async (teamA, teamB) => {
    await db.none(
        'INSERT INTO matches (teama_id, teamb_id, status, result) values ($1, $2, $3, $4)',
        [teamA, teamB, "PLANNED", "0:0"]
    );
}

const deleteMatch = async (id) => {
    await db.none('DELETE FROM matches WHERE id = $1', [id]);
}

const updateScore = async (matchId, newScore) =>{
    try{
        const query = "UPDATE matches SET result = $1 WHERE id = $2";
        db.none(query, [newScore, matchId]);
    }catch(error){
        console.error(error);
        return {status: 500};
    }
}

const startMatch = async(matchId)=>{
    try{
        const query = "UPDATE matches SET date = CURRENT_TIMESTAMP, status = $1 WHERE id = $2";
        db.none(query, ["IN_PROGRESS", matchId]);
    }catch(error){
        console.error(error);
        return {status: 500};
    }
}

const endSet = async(matchId, resultDetailed)=>{
    try{
        const query = "UPDATE matches SET resultdetailed = $1, result = $2 WHERE id = $3";
        db.none(query, [resultDetailed, "0:0", matchId]);
    }catch(error){
        console.error(error);
        return {status: 500};
    }
}

const swapTeams = async(matchId, newTeamA, newTeamB, result, resultDetailed)=>{
    try{
        const query = "UPDATE matches SET teama_id = $1, teamb_id = $2, result = $3, resultdetailed = $4 WHERE id = $5";
        db.none(query, [newTeamA, newTeamB, result, resultDetailed, matchId]);
    }catch(error){
        console.error(error);
        return {status: 500};
    }
};

const endMatch = async(matchId)=>{
    try{
        const query = "UPDATE matches set status = $1 WHERE id = $2";
        db.none(query, ["FINISHED", matchId]);
    }catch(error){
        console.error(error);
        return {status: 500};
    }
}

module.exports = {
    getMatches,
    getMatchById,
    addMatch,
    deleteMatch,
    updateScore,
    startMatch,
    endSet,
    swapTeams,
    endMatch,
}