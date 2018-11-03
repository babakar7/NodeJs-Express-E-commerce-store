const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
// create a server
const app = express();
// import routes
const sequelize = require('./util/database')
// set global configutation value. can be read with app.get
// add pug template engine
const Product = require('./models/product')
const User = require('./models/user')

const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

app.set('view engine', 'pug')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended: false}));
// use built in static middleware. takes a path to folder you want to serve statically
// this is granting read access
// path join helps with different OS path syntax
// this will take any request that looks for a file and forward it to public folder
app.use(express.static(path.join(__dirname, 'public')))
// adminRoutes is a valid middleware function
// prefix routes with /admin. only routes starting with /admin
// and we don't have to add the prefix in the router!

// register a middleware to access user from anywhere.
// triggered only by incoming requests/
app.use((req, res, next)=>{



  User.findById(1).then((user)=>{

    // add new fiedl to request object.
    // store sequelize object in the request so we can execute methods on it
    req.user = user
    // move on

    next()

  }).catch((err)=>{
    console.log(err)
  })
})




app.use('/admin', adminRoutes);
// order matters here
app.use(shopRoutes);

// cach all routes that are not registered
app.use('/', (req, res, next)=> {

  res.sendFile(path.join(__dirname, 'views', 'notfound.html'))

})



// set relationships.
// A product belongs to a User
Product.belongsTo(User, {
  constraints:true,
  // if user is delete, associate products are deleted
  onDelete:'CASCADE',
})
// optional
User.hasMany(Product)

// this will add a foreign key to the cart which is a user ID
User.hasOne(Cart)
// optional. is added by sequelize
Cart.belongsTo(User)

// many to many relationship // hasMnay too ?
// this relationship needs intermediary table
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})

// check all models defined and sync the database. creates tables for the models
// force to true not used in developement, just to apply database relationships that
// were defined after the fact
sequelize.sync(/*{force:true}*/).then((result)=>{
  // only start server it this succeeds

   return User.findById(1)

}).then((user)=>{

  if(!user){

  return  User.create({
      name:'babakar',
      email: 'admin@admin.com'
    })
  }
  // if we already have a user
  // but need to return promise for consistenty with previous if
  return Promise.resolve(user);


}).then((user)=>{


    return user.createCart()

})
.then((cart)=>{
  app.listen(process.env.PORT || 3000);

})

  .catch((err)=>{
    console.log('error syncing', err)
  })
