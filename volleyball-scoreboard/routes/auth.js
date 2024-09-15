var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var { createUser, findUserByLogin } = require('../models/users');

router.get('/logout', (req, res) =>{
    req.session.userId = null;
    req.session.userRole = null;
    res.redirect('/');
})

router.get('/register', (req, res) =>{
    res.render('register', {});
});

router.post('/register', async (req, res) =>{

    const {login, password} = req.body;

    try{
        const user = await findUserByLogin(login);
        if (user) {
            return res.render('register', {errorMessage: 'User already exists'});
        }

        const userId = await createUser(login, password);
        return res.redirect('/auth/login');

    }catch(error){
        return res.render('register', {errorMessage: 'Internal server error'});
    }

});

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.post('/login', async (req, res) => {

    const  {login, password} = req.body;
    
    try{

        const user = await findUserByLogin(login);
        if(!user){
            return res.render('login', {erorrMessage: 'Incorrect login or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render('login', {errorMessage: 'Incorrect login or password'});
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.login = user.login;

        return res.redirect('/');

    }catch(error){
        return res.render('register', {errorMessage: 'Internal server error'});
    
    }

});

module.exports = router;