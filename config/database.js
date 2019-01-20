const Sequelize = require('sequelize');

module.exports = new Sequelize('testnut', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});