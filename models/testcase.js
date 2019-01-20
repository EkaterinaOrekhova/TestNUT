const Sequelize = require('sequelize');
const db = require('../config/database');

const Testcase = db.define('testcase', {
  description: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
    required: true
  },
  author: {
    type: Sequelize.STRING,
  },
  sectionid: {
    type: Sequelize.INTEGER,
  }
});

//User.removeAttribute('id');

module.exports = Testcase;