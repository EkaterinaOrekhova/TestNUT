const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

const Op = Sequelize.Op;

//Display home page
router.get('/', (req, res) => res.render('index', { layout: '../views/layouts/start' } ));

//Display login page
router.get('/login', (req, res) => res.render('login', { layout: '../views/layouts/user' }));

//Display register page
router.get('/register', (req, res) => res.render('register', { layout: '../views/layouts/user' }));

//Click on Register button
router.post('/register', (req, res) => {
    const {login, email, password, password2} = req.body;

    let errors = [];

    //Check required fields
    if(!login || !email || !password || !password2) {
        errors.push({ msg: 'Пожалуйста, заполните все поля!'});
    }

    //Check passwords match
    if(password !== password2){
        errors.push({ msg: 'Пароли не совпадают!'});
    }

    //Check password length
    if(password.length < 6){
        errors.push({ msg: 'Длина пароля не должна быть менее 6 символов!'});
    }

    if (errors.length > 0){
        res.render('register', { 
            layout: '../views/layouts/user',
            errors,
            login,
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ 
           where: {
            [Op.or]: [
                { email: email }, 
                { login: login }
            ]
            //email: email
            }
        })
        .then(user => {
            if(user){
                if (user.login == login){
                //User exists
                    errors.push({ msg: 'Пользователь с таким логином уже зарегистрирован!'});
                    res.render('register', { 
                        layout: '../views/layouts/user',
                        errors,
                        login,
                        email,
                        password,
                        password2
                    });
                };
                if (user.email == email){
                    //User exists
                        errors.push({ msg: 'Пользователь с такой эл. почтой уже зарегистрирован!'});
                        res.render('register', { 
                            layout: '../views/layouts/user',
                            errors,
                            login,
                            email,
                            password,
                            password2
                        });
                };                
            } else {
                const newUser = new User({
                    login,
                    email,
                    password
                });

                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;

                      //Set password to hashed
                      newUser.password = hash;
                      //Save user
                      newUser.save()
                      .then(user => {
                          req.flash('success_msg', 'Вы успешно зарегистрированы!');
                          res.redirect('/login');
                      })
                      .catch(err => console.log('Error:' + err));
                }));
            };
        })
        .catch(err => console.log('Error:' + err));
    }
});

//Click on Login button
router.post('/login', (req, res, next) => {
    const {login, password} = req.body;

    if (!login || !password) {
        req.flash('error_msg', 'Пожалуйста, заполните все поля!');
        res.redirect('/login');
    } else{
        passport.authenticate('local', {
            successRedirect: '/startpage',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    };   
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Вы вышли из учетной записи!');
    res.redirect('/login');
});

router.get('/account', (req, res) => {

    User.findByPk(req.user.id)
    .then(ok => {
        res.render('account', { 
            layout: '../views/layouts/main',
            login: ok.login,
            email: ok.email 
        })
    })
    .catch(err=> console.log(err));
    
});

router.post('/startpage/changepassword', (req, res) => {

    const {password, password2, password3} = req.body;
    console.log(req.user.login + "  " + req.user.email);
    let errors = [];
    //Check required fields
    if(!password || !password2 || !password3) {
        errors.push({ msg: 'Пожалуйста, заполните все поля!'});
    }

     //Check passwords match
    if(password2 !== password3){
        errors.push({ msg: 'Новые пароли не совпадают!'});
    }

    if (errors.length > 0){
        res.render('account', { 
            layout: '../views/layouts/main',
            errors,
            login: req.user.login,
            email: req.user.email
        });
    } else {
        // Match user
      User.findOne({
        where: {
            login: req.user.login
        }
      })
      .then(user => {
        // Match password

        bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) console.log(err);
        if (isMatch) {
            console.log('совпадают');
                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(password2, salt, (err, hash) => {
                    if (err) console.log(err);
                    //Set password to hashed
                    user.update({
                        password : hash
                    })
                    .then(ok =>
                        {
                            req.flash('success_msg', 'Пароль изменен!');
                            res.redirect('/account');
                        })
                    .catch(err => console.log('Error:' + err));
                }));         
        } else {
            console.log('не совпадают');
            errors.push({ msg: 'Старый пароль не верный!'});
            res.render('account', { 
                layout: '../views/layouts/main',
                errors,
                login: req.user.login,
                email: req.user.email
            });
          };
        });
      })
      .catch(err => console.log('Error:' + err));
    };
});

router.post('/startpage/changeinf', (req, res) => {

    const {login, email} = req.body;

    let errors = [];
    //Check required fields
    if(!login || !email ) {
        errors.push({ msg: 'Пожалуйста, заполните все поля!'});
    }
    console.log(req.user.login + '  ' + req.user.email);
    if (errors.length > 0){
        res.render('account', { 
            layout: '../views/layouts/main',
            errors,
            login: login,
            email: email
        });
    } else {
        
        User.findOne({ 
            where: {
             [Op.or]: [
                 { email: email }, 
                 { login: login }
             ]
             //email: email
             }
         })
         .then(user => {
             if(user){
                 if (user.login == login && login != req.user.login){
                     console.log('Пользователь с таким логином уже зарегистрирован!');
                 //User exists
                     errors.push({ msg: 'Пользователь с таким логином уже зарегистрирован!'});
                     res.render('account', { 
                         layout: '../views/layouts/user',
                         errors,
                         login,
                         email
                     });
                 };
                 if (user.email == email && email != req.user.email){
                     //User exists
                     console.log('Пользователь с такой эл. почтой уже зарегистрирован!');
                         errors.push({ msg: 'Пользователь с такой эл. почтой уже зарегистрирован!'});
                         res.render('account', { 
                             layout: '../views/layouts/user',
                             errors,
                             login,
                             email
                         });                       
                 };
                 User.findOne({
                    where:{
                        id: req.user.id
                    }
                })
                .then(ok =>{
                   
                   ok.update({
                       email : email,
                       login: login
                   })
                   .then(ok2 =>
                       {
                           //req.flash('success_msg', 'Данные изменены!');
                           res.render('account', { 
                               layout: '../views/layouts/main',
                               errors,
                               login : ok2.login,
                               email: ok2.email
                           });
                       })
                   .catch(err => console.log('Error:' + err));
                })
                .catch(err => console.log(err))                               
             } else {                
                 User.findOne({
                     where:{
                         id: req.user.id
                     }
                 })
                 .then(ok =>{
                    
                    ok.update({
                        email : email,
                        login: login
                    })
                    .then(ok2 =>
                        {
                            //req.flash('success_msg', 'Данные изменены!');
                            res.render('account', { 
                                layout: '../views/layouts/main',
                                errors,
                                login : ok2.login,
                                email: ok2.email
                            });
                        })
                    .catch(err => console.log('Error:' + err));
                 })
                 .catch(err => console.log(err));                           
             };
         })
         .catch(err => console.log('Error:' + err));
    };
});

module.exports = router;
