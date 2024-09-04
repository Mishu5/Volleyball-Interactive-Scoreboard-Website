const db = require('../routes/db');

const getMatches = async (status) => {
    let query = 'SELECT * FROM mecze ';
    if(status) {
        query += ' WHERE status = $1 ';
    }
    query += 'ORDER BY data DESC';

    const matches = await db.any(query, status ? [status] :[]);
    return matches;
}

const getMatchById = async (id) => {
    const match = await db.one('SELECT * FROM mecze WHERE id = $1');
    return match;
}

const addMatch = async (match) => {
    const {data, teamA, teamB, result, resultDetailed, timeline, status } = match;
    await db.none(
        'INSERT INTO mecze(data, teamA, teamB, result, resultDetailed, timeline, status) values ($1, $2, $3, $4, $5, $6, $7)',
        [data, teamA, teamB, result, resultDetailed, timeline, status]
    );
}

const deleteMatch = async (id) => {
    await db.none('DELETE FROM mecze WHERE id = $1', [id]);
}

//TODO add updating match status

module.exports = {
    getMatches,
    getMatchById,
    addMatch,
    deleteMatch
}