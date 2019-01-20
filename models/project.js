const Sequelize = require('sequelize');
const db = require('../config/database');

const Project = db.define('project', {
  name: {
    type: Sequelize.STRING,
    required: true
  }
});

//User.removeAttribute('id');

module.exports = Project;