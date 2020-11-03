var express = require('express');
var router = express.Router();

var bikeController = require('../controllers/bikeController')
var brandController = require('../controllers/brandController')
var categoryController = require('../controllers/categoryController')



router.get('/', function(req,res,err) {
    res.render('index', {title: "hello"})
})

//router.get('/category', categoryController.CategoryList)

router.get('/bike', bikeController.bikeList);

router.get('/bikeInstance', bikeController.bikeInstance);


//router.get('/brand', brandController.BrandList);


module.exports = router;