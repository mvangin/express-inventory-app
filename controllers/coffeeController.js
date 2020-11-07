let Coffee = require('../models/coffee');
let Brand = require('../models/brand')
const { body, validationResult } = require('express-validator')
let async = require('async')
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
        res.render('coffeeUpdateForm', { brands: results.brands, coffeeItem: results.coffeeItem, selectedBrand })
    })
}

exports.coffeeUpdatePost = function (req, res, next) {
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

    Coffee.findByIdAndUpdate(req.params.id, coffee, function (err, coffeeItem) {
        if (err) {
            return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(coffeeItem.url);
    });
}



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



exports.coffeeCreatePost = function (req, res, next) {
    console.log()
    let name = req.body.name
    let description = req.body.description
    let categories = req.body.categories
    let brand = req.body.brand
    let price = req.body.price
    let location = req.body.location
    let stock = req.body.stock

    let coffee = new Coffee({name, description, categories, brand, price, location, stock})
    coffee.save(function (err) {
        if (err) {
            next(err)
            return
        }
        res.redirect('/catalog/coffee');

    })
}


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