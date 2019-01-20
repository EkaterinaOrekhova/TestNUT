const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const TestCase = require('../models/testcase');
const CaseStep = require('../models/casestep');
const Project = require('../models/project');
const Section = require('../models/section');

router.get('/', (req, res) => res.render('test', { 
    layout: '../views/layouts/testlayout',
    login: req.user.login
}));

module.exports = router;