const Product = require('../models/product.js')
const Cart = require('../models/cart.js')


module.exports.getCart = (req, res, next)=>{

  req.user.getCart().then((cart)=>{

      return cart.getProducts()
  }).then((products)=>{
    console.log('PRODUCTS!!!!!!!!!!', products)

    res.render('shop/cart', {
      prods:products,
      path:'/cart'
    })
  })
}


module.exports.postToCart = (req, res, next)=>{

  let fetchedCart

    req.user.getCart()

    .then((cart)=>{

      fetchedCart = cart
      // find if product is in the cart
      return cart.getProducts({where:{
        id:req.body.id
      }})


    })
    .then((products)=>{

        let product

        products.length > 0 ?  product = products[0] : undefined


        let newQuantity  = 1

        if (product){

            let oldQuantity = product.cartItem.quantity

            newQuantity = oldQuantity + 1

            return fetchedCart.addProduct(product, {
              through:{quantity:newQuantity}
            })


        } else{

          // can have nested then statements but also chained ones
          return  Product.findById(req.body.id).then((product)=>{

            // seuqelize makes this possible
              return fetchedCart.addProduct(product, {
                // adiitional info neede for in between table
                through:{quantity:newQuantity}
              })
          })

        }

    })
    .then(()=>{
      res.redirect('/cart')
    })
    .catch((err)=>{
      console.log(err)
    })
}


module.exports.deleteProduct = (req, res, next)=>{

  req.user.getCart().then((cart)=>{

    return cart.getProducts({where:{id:req.body.id}})

  }).then((products)=>{

    // delete product only in the in between carItem table
     return products[0].cartItem.destroy()
  })
  .then((result)=>{
    res.redirect('/cart')
  }).catch((err)=>{
    console.log(err)
  })

}
