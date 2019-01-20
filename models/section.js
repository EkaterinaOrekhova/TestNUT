const Sequelize = require('sequelize');
const db = require('../config/database');

const Section = db.define('section', {
  name: {
    type: Sequelize.STRING,
    required: true
  },
  projectid: {
    type: Sequelize.INTEGER,
    required: true   
  }
});

//User.removeAttribute('id');

module.exports = Section;