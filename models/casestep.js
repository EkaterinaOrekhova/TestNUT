const Sequelize = require('sequelize');
const db = require('../config/database');

const Casestep = db.define('casestep', {
  description: {
    type: Sequelize.STRING,
    required: true
  },
  result: {
    type: Sequelize.STRING    
  },
  stepnumber: {
    type: Sequelize.INTEGER,
    required: true
  },
  testcaseid: {
    type: Sequelize.INTEGER,
    required: true
  }
});

//User.removeAttribute('id');

module.exports = Casestep;