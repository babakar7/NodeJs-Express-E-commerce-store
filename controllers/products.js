const Product = require('../models/product.js')

module.exports.getAddProduct = (req, res, next) => {
// res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'))
res.render('admin/add-product', {

  pageTitle:'Add Product',
  path:'/admin/add-product'

  })
}

module.exports.postAddProduct = (req, res, next) => {

  //let product = new Product(req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price  )
  // creates a new element and saves it immediately
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

// use sequelize built in metod for belongTo relationships
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    // add user from middleware info in app.js
  })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err);
    });

    res.redirect('/')
}

module.exports.getProducts = (req, res, next)=>{
  // dirname holds absolute path on our OS to this folder
  // dirname returns path to the current folder (routes)
  // slashes are added by join and builds it in a way that it works on all OS systems
// pug is already defined as the default in app.js. will use default templating engine
// all views are already defined to be in the view folder so no need to contruct a path
// similar to laravel's return view

req.user.getProducts()
Product.findAll().then((products)=>{

  res.render('shop/product-list', {
    prods:products,
    pageTitle:'My Shop',
    path:'/'})

  }).catch((err)=>{console.log(err)})
}





module.exports.getAdminProducts = (req, res, next) =>{
// findAll returns an array

req.user.getProducts()
 .then((products)=>{

    res.render('admin/products', {
      prods:products,
      pageTitle:'My Shop',
      path:'admin/products'})

    }).catch((err)=>{console.log(err)})

}

module.exports.getSingleProduct = (req, res, next) => {


    Product.findById(req.params.id).then((product)=>{

      console.log(product)

      res.render('shop/product', {
        product:product,
        pageTitle:'My Shop',
        path:'/'})

    }).catch((err)=>{console.log(err)})


}



module.exports.getEditProduct = (req, res, next) =>{

// relationship method provided by sequelize
// caregul thoug because Products returns an array
   req.user.getProducts({where:{id:req.params.id}})

  /*Product.findById(req.params.id)*/.then((products)=>{

    res.render('admin/edit-product', {
      product:products[0],
      pageTitle:'Edit Product',
      path:'admin/edit'})

  }).catch((err)=>{console.log(err)})


}



// no nedd for relationship methods. we get to this stage only if it shows the Products
// for a specific user
module.exports.postEditProduct = (req, res, next) =>{

  Product.update({
    title:req.body.title,
    description:req.body.description,
    price:req.body.price,
    imageUrl:req.body.imageUrl

  }, {where:{id:req.params.id}}).then(()=>{
    console.log('done')
    res.redirect('/admin/products')
  })
}

module.exports.deleteProduct = (req, res, next) =>{


  Product.destroy({where: {id:req.params.id}})

  res.redirect('/admin/products')
}
