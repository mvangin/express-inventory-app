var express = require('express');
var router = express.Router();

var coffeeController = require('../controllers/coffeeController')
var brandController = require('../controllers/brandController')
var categoryController = require('../controllers/categoryController')



router.get('/', function(req,res,err) {
    res.render('index', {title: "Snuffels"})
})

//router.get('/category', categoryController.CategoryList)


router.get('/coffee', coffeeController.coffeeList);

router.get('/coffee/create', coffeeController.coffeeCreateGet);

router.post('/coffee/create', coffeeController.coffeeCreatePost);

router.get('/coffee/roast/:categories', coffeeController.coffeeRoastGet)


router.get('/coffee/:id', coffeeController.coffeeDetail)
//router.get('/bikeInstance', coffeeController.bikeInstance);

router.get('/coffee/:id/update', coffeeController.coffeeUpdateGet);

router.post('/coffee/:id/update', coffeeController.coffeeUpdatePost)

router.post('/coffee/:id/delete', coffeeController.coffeeDeletePost)



router.get('/brand', brandController.brandList);

router.get("/brand/create", brandController.brandCreateGet)

router.post("/brand/create", brandController.brandCreatePost)


router.get('/brand/:id', brandController.brandDetail)

router.get('/brand/:id/update', brandController.brandUpdateGet)

router.post('/brand/:id/update', brandController.brandUpdatePost)



router.post('/brand/:id/delete', brandController.brandDeletePost)

//router.get('/brand', brandController.BrandList);

module.exports = router;