const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const TestCase = require('../models/testcase');
const CaseStep = require('../models/casestep');
const Project = require('../models/project');
const Section = require('../models/section');

//Display register page
router.get('/', ensureAuthenticated, (req, res) => {
    let date = require('date-and-time');
    date.locale('ru');

    res.render('startpage', { 
        layout: '../views/layouts/main',
        login: req.user.login,
        date: date.format(new Date(), 'dddd D MMMM, YYYY')
    });
});

router.get('/testcases', (req, res) => {
    
    var projects123 = [];

    Project.findAll()
    .then(ok => 
        {
                TestCase.findAll()
                .then(testcases => {
                res.render('testcases', {
                layout: '../views/layouts/main',
                login: req.user.login,
                testcases: testcases,
                projects: ok
        })
    })
    .catch(err => console.log('Error:' + err));

        })
    .catch(err => console.log(err));
    
    
    
});

router.get('/testcases/add', (req, res) => {

    if (req.body.testcaseID != undefined){
        casesteps = [];
    } else{
        var casesteps = [];
        res.render('add', {
            layout: '../views/layouts/main',
            login: req.user.login,
            casesteps
        });
    }  
    
});

router.post('/testcases/add', (req, res) => {
    console.log('perfect');
    const {testcaseID, name, author, description} = req.body;

    let errors = [];

    //Check required fields
    if(!name) {
        errors.push({ msg: 'Пожалуйста, укажите название теста!'});
    }

    if (errors.length > 0){        
        res.render('add', { 
            layout: '../views/layouts/main',
            errors,
            name,
            login: req.user.login,
            author,
            description,
            testcaseID
        });
    } else {
        if (testcaseID != 0){
            TestCase.findById(testcaseID)
            .then(testcase => {
                testcase.update({
                    name: name,
                    author: author,
                    description: description
                })
                .then(ok => {
                    CaseStep.findAll({
                        where: {
                            testcaseid: testcaseID
                        }
                    })
                    .then(steps => {
                        res.render('add', { 
                            layout: '../views/layouts/main',
                            errors,
                            name,
                            login: req.user.login,
                            author,
                            description,
                            testcaseID,
                            casesteps: steps 
                        });
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));             
            })
            .catch(err => console.log('Error:' + err));
        } else {

            const newTest = new TestCase({
                name,
                author,
                description
            });

            newTest.save()
            .then(testcase => {
                CaseStep.findAll({
                    where: {
                        testcaseid: testcaseID
                    }
                })
                .then(steps => {
                    res.render('add', { 
                        layout: '../views/layouts/main',
                        errors,
                        name,
                        login: req.user.login,
                        author,
                        description,
                        testcaseID: testcase.id,
                        casesteps: steps
                    });
                })
                .catch(err => console.log(err));               
            })
            .catch(err => console.log('Error:' + err));
        };    
    }
});

router.delete('/testcases/delete:id', function(req, res){

    TestCase.destroy({
        where: {
          id: req.params.id
        }
    })
    .then(test =>
        {
            console.log('Успешный вызов запроса ' + req.params.id);
            res.send(200);
        })
    .catch(err => console.log(err));  
});

router.get('/testcases/edit:id', (req, res) => {

    TestCase.findById(req.params.id)
    .then(testcase => {
        CaseStep.findAll({
            where: {
                testcaseid: testcase.id
            }
        })
        .then(steps => {
            res.render('edittestcase', {
                layout: '../views/layouts/main',
                login: req.user.login,
                testcase: testcase,
                casesteps: steps
            })
        })
        .catch(err => console.log(err));       
    })
    .catch(err => console.log('Error:' + err));

});

router.post('/testcases/edit:id', (req, res) => {

    const {name, author, description} = req.body;

    let errors = [];

    //Check required fields
    if(!name) {
        errors.push({ msg: 'Название теста не может быть пустым!'});
    }

    if (errors.length > 0){
        TestCase.findById(req.params.id)
        .then(testcase => {
            res.render('edittestcase', {
                errors,
                layout: '../views/layouts/main',
                login: req.user.login,
                testcase: testcase
            })
        })
        .catch(err => console.log('Error:' + err));
    } else {
            TestCase.findById(req.params.id)
            .then(testcase => {
                testcase.update({
                    name: name,
                    author: author,
                    description: description
                })
                .then(ok => {
                    CaseStep.findAll({
                        where: {
                            testcaseid: testcase.id
                        }
                    })
                    .then(steps => {
                        res.render('edittestcase', {
                            layout: '../views/layouts/main',
                            errors,
                            login: req.user.login,
                            testcase: testcase,
                            casesteps: steps
                        })
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));             
            })
            .catch(err => console.log('Error:' + err));
    };
});

router.get('/testcases/add/save', (req, res) => {

    console.log('perfect');
    const {testcaseID, name, author, description} = req.body;

    let errors = [];

    //Check required fields
    if(!name) {
        errors.push({ msg: 'Пожалуйста, укажите название теста!'});
        console.log(testcaseID + ' ' + name + ' ' + author + ' ' + description);
    }

    if (errors.length > 0){        
        res.render('add', { 
            layout: '../views/layouts/main',
            errors,
            name,
            login: req.user.login,
            author,
            description,
            testcaseID
        });
    } else {
        if (testcaseID){
            TestCase.findById(testcaseID)
            .then(testcase => {
                res.render('add', {
                    layout: '../views/layouts/main',
                    errors,
                    name,
                    login: req.user.login,
                    author,
                    description,
                    testcaseID
                })
            })
            .catch(err => console.log('Error:' + err));
        } else {
            const newTest = new TestCase({
                name,
                author,
                description
            });

            newTest.save()
            .then(testcase => {
                res.render('add', { 
                    layout: '../views/layouts/main',
                    errors,
                    name,
                    login: req.user.login,
                    author,
                    description,
                    testcaseID : testcase.id
                });
            })
            .catch(err => console.log('Error:' + err));
        };    
    }
});

router.post('/testcases/addcasestep:id', (req, res) =>{
    const {description, result} = req.body;
    var stepnumber = 1;

    CaseStep.max('stepnumber', {
        where: {
            testcaseid: req.params.id
        }
    })
    .then(number => {
        if (number) {stepnumber = number + 1;}

        const newStep = new CaseStep({
            description : description,
            result : result,
            stepnumber : stepnumber,
            testcaseid: req.params.id
        });

        newStep.save()
        .then(step => {       
            TestCase.findById(req.params.id)
            .then(testcase => {
                CaseStep.findAll({
                    where: {
                        testcaseid: testcase.id
                    }
                })
                .then(steps => {
                    res.redirect('/startpage/testcases/edit'+ req.params.id)
                })
                .catch(err => console.log(err));       
            })
            .catch(err => console.log('Error:' + err));
        })
        .catch(err => console.log('Error:' + err));
    })
    .catch(err => console.log(err));
});

router.delete('/testcases/casestep/delete:id', function(req, res){

    CaseStep.destroy({
        where: {
          id: req.params.id
        }
    })
    .then(test =>
        {
            console.log('Успешный вызов запроса ' + req.params.id);
            res.send(200);
        })
    .catch(err => console.log(err)); 
});

router.post('/testcases/stepcaseedit:id', (req, res) => {
    console.log('Вы пришли куда надо');

    const {description, result, stepid_at_modal_window} = req.body;
    console.log('ИД ' + stepid_at_modal_window);
    CaseStep.findOne({
        where: {
            stepnumber: stepid_at_modal_window,
            testcaseid: req.params.id
        }
    })
    .then(step => {
        step.update({
            description : description,
            result : result
        })
        .then(ok =>
            res.redirect('/startpage/testcases/edit'+ req.params.id)
        )
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/testcases/sort:id', (req, res) => {
    TestCase.findAll({
        where: {
            sectionid: req.params.id
        }
    })
    .then(ok =>{       
        Project.findAll()
        .then(myres => {
            res.render('testcases',
                    {
                        layout: '../views/layouts/main',
                        testcases: ok,
                        login: req.user.login,
                        projects: myres
                    });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
    
});


module.exports = router;