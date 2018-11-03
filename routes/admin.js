const express = require('express')

const path = require('path')

const router = express.Router()

const ProductsController = require('../controllers/products.js')


router.get('/add-product', ProductsController.getAddProduct)

router.get('/products', ProductsController.getAdminProducts)

router.get('/product/:id', ProductsController.getEditProduct)

router.post('/add-product',ProductsController.postAddProduct )

router.post('/store/:id', ProductsController.postEditProduct)

router.get('/product/delete/:id', ProductsController.deleteProduct)

module.exports = router
