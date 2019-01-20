const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
  login: {
    type: Sequelize.STRING,
    required: true
  },
  email: {
    type: Sequelize.STRING,
    required: true
  },
  password: {
    type: Sequelize.STRING,
    required: true
  }
});

//User.removeAttribute('id');

module.exports = User;