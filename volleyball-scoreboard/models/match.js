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
    const match = await db.one('SELECT * FROM matches WHERE id = $1');
    return match;
}

const addMatch = async (teamA, teamB) => {
    await db.none(
        'INSERT INTO matches (teamA, teamB, status) values ($1, $2, $3)',
        [teamA, teamB, "PLANNED"]
    );
}

const deleteMatch = async (id) => {
    await db.none('DELETE FROM matches WHERE id = $1', [id]);
}

//TODO add updating match status

module.exports = {
    getMatches,
    getMatchById,
    addMatch,
    deleteMatch
}