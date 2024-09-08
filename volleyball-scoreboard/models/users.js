const db = require('../routes/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createUser(login, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let query = 'INSERT INTO uzytkownicy (login, password, role) VALUES ($1, $2, $3) RETURNING id';
    const result = await db.one(query, [login, hashedPassword, "observator"]);
    return result.id;
}

async function findUserByLogin(login) {
    let query = 'SELECT * FROM uzytkownicy WHERE login = $1';
    const result = await db.oneOrNone(query, [login]);
    return result;
}

async function initializeAdminUser(){
    try{

        const adminUser = await findUserByLogin(process.env.ADMIN_LOGIN);
        
        if(!adminUser){

            const adminLogin = process.env.ADMIN_LOGIN;
            const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            let query = 'INSERT INTO uzytkownicy (login, password, role) VALUES ($1, $2, $3)';
            await db.none(query, [adminLogin, adminPassword, "referee"]);

        }else{
            console.log('Admin already exists');
        }

    }catch(error){
        console.error('Error in creating admin user: ', error);
    }
}

module.exports = {
    createUser,
    findUserByLogin,
    initializeAdminUser,
}