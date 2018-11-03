const Sequelize= require('sequelize')

// this will automatically set up a connection pool
const sequelize = new Sequelize('heroku_55e837713f867fc', 'bbfacf12d38bc1', '2bfa5db7', {
  dialect:'mysql',
  host:'us-cdbr-iron-east-01.cleardb.net',
})


module.exports = sequelize
