var express = require('express');
var router = express.Router();

var coffeeController = require('../controllers/coffeeController')
var brandController = require('../controllers/brandController')
var categoryController = require('../controllers/categoryController')



router.get('/', function(req,res,err) {
    res.render('index', {title: "hello"})
})

//router.get('/category', categoryController.CategoryList)

router.get('/coffee', coffeeController.coffeeList);

router.get('/coffee/:id', coffeeController.coffee_detail)
//router.get('/bikeInstance', coffeeController.bikeInstance);


//router.get('/brand', brandController.BrandList);


module.exports = router;