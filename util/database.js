const Sequelize= require('sequelize')

// this will automatically set up a connection pool
const sequelize = new Sequelize('nodejs', 'babakar', 'papillon', {
  dialect:'mysql',
  host:'127.0.0.1',
  port:'8889'
})


module.exports = sequelize
