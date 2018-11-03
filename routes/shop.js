const express = require('express')

// helps us return views
const path = require('path')

const productsController = require('../controllers/products')

const cartController = require('../controllers/cart')

const router = express.Router()

router.get('/',  productsController.getProducts)

router.get('/cart', cartController.getCart)

router.post('/cart', cartController.postToCart)

router.get('/product/:id', productsController.getSingleProduct)

router.post('/cart/delete', cartController.deleteProduct)

module.exports = router
