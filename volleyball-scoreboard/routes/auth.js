var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var { createUser, findUserByLogin } = require('../models/users');

router.get('/register', (req, res) =>{
    
});

router.post('/register', async (req, res) =>{

    const {login, password} = req.body;

    try{
        const user = await findUserByLogin(login);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userId = await createUser(login, password);
        res.status(201).json({message: "User created"});

    }catch(error){
        res.status(500).json({message : "Error in creating user"});
        console.error(error);
    }

});

router.get('/login', (req, res) => {
    
});

router.post('/login', async (req, res) => {

    const  {login, password} = req.body;
    
    try{

        const user = await findUserByLogin(login);
        if(!user){
            res.status(400).json({message: 'Incorrect login or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: 'Incorrect login or password'});
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;

        res.status(200).json({message: 'Logged in'});

    }catch(error){
        res.status(500).json({message: 'Server error'});
        console.error(error);
    }

});

module.exports = router;