let Coffee = require('../models/coffee');
let Brand = require('../models/brand');
const { body, validationResult } = require('express-validator');
let async = require('async');
var mongoose = require('mongoose');

//let BikeInstance = require('../models/bikeInstance')

exports.coffeeList = function (req, res, next) {
    Coffee.find({}, 'name categories')
        .exec(function (err, coffeeList) {
            if (err) {
                return next(err)
            }
            console.log(coffeeList)
            res.render('coffeeList', { title: 'Coffee Inventory', coffeeList })
        })
}

exports.coffeeDetail = function (req, res, next) {
    Coffee.findById(req.params.id)
        .populate('brand')
        .exec(function (err, coffeeItem) {
            if (err) {
                return next(err)
            }
            res.render('coffee_detail', { coffeeItem })
        })
}

exports.coffeeUpdateGet = function (req, res, next) {
    async.parallel({
        brands: function (callback) {
            Brand.find({}, "name")
                .exec(callback)
        },
        coffeeItem: function (callback) {
            Coffee.findById(req.params.id)
                .populate('brand')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err)
        }
        let selectedBrand
        results.brands.forEach(brand => {
            if (brand._id.toString() == results.coffeeItem.brand._id.toString()) {
                selectedBrand = brand
            }
        })
        
        console.log(results.coffeeItem.categories)
        console.log(selectedBrand)

        res.render('coffeeCreateForm', { brands: results.brands, coffee: results.coffeeItem, selectedBrand})
    })
}

exports.coffeeRoastGet = function (req, res, next) {
    console.log(req.params.roast)
    Coffee.find({ categories: req.params.categories + " roast" })
        .exec(function (err, coffeeList) {
            if (err) {
                return next(err)
            }
            let startUpper = req.params.categories.slice(0, 1).toUpperCase();
            let capitalized = startUpper + req.params.categories.slice(1)
            res.render('coffeeListRoasts', { coffeeList, title: capitalized + " Roast" })
        })
}

exports.coffeeUpdatePost = [
    body('name', 'name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'description required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be a number').isNumeric(),
    body('location', 'location required').trim().isLength({ min: 1 }).escape(),
    body('stock', 'stock required').trim().isLength({ min: 1 }).escape(),
    body('stock', 'stock must be a number').isNumeric(),

    async (req, res, next) => {
        const errors = validationResult(req);

        let coffee = new Coffee(
            {
                name: req.body.name,
                description: req.body.description,
                categories: req.body.categories,
                brand: req.body.brand,
                price: req.body.price,
                location: req.body.location,
                stock: req.body.stock,
                _id: req.params.id
            })
        let brands = await Brand.find({}, 'name')
        if (!errors.isEmpty()) {
            console.log(errors)

            res.render('coffeeCreateForm', { coffee, brands, errors: errors.array() })
        } else {

            Coffee.findByIdAndUpdate(req.params.id, coffee, function (err, coffeeItem) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to book detail page.
                console.log(req.body.price)
                res.redirect(coffeeItem.url);
            });
        }
    }
]




exports.coffeeDeletePost = function (req, res, next) {
    Coffee.findByIdAndRemove(req.params.id, {}, function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/catalog/coffee');
    })
}

exports.coffeeCreateGet = function (req, res, next) {
    Brand.find({}, "name")
        .exec(function (err, brands) {
            if (err) {
                return next(err)
            }
            res.render('coffeeCreateForm', { brands })
        })
}



exports.coffeeCreatePost = [

    body('name', 'name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'description required').trim().isLength({ min: 1 }).escape(),
    body('price', 'price required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be a number').isNumeric(),
    body('location', 'location required').trim().isLength({ min: 1 }).escape(),
    body('stock', 'stock required').trim().isLength({ min: 1 }).escape(),
    body('stock', 'stock must be a number').isNumeric(),

    async (req, res, next) => {

        const errors = validationResult(req);

        let name = req.body.name;
        let description = req.body.description;
        let categories = req.body.categories;
        let brand = req.body.brand;
        let price = req.body.price;
        let location = req.body.location;
        let stock = req.body.stock;

        let coffee = new Coffee({ name, description, categories, brand, price, location, stock });
        let brands = await Brand.find({}, 'name')

        if (!errors.isEmpty()) {
            console.log(errors)
            brands.execute(
                res.render('coffeeCreateForm', { coffee, brands, errors: errors.array() })
            )

        } else {

            coffee.save(function (err) {
                if (err) {
                    next(err)
                    return
                }

                res.redirect('/catalog/coffee');

            })
        }
    }
]


/* exports.bikeInstance = function (req, res, err) {
    BikeInstance.find({}, 'bike')
        .populate('bike')

        .exec(function (err, bikeInstances) {
            if (err) {
                return next(err)
            }
            console.log(bikeInstances)
            let total = bikeInstances.filter(item => item.bike.name === 'Aethos').length;

            res.render('bikeInstances', { title: 'Bike instance List', total })
        })
}

*/