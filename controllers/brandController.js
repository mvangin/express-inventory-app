let Brand = require('../models/brand')
let async = require('async')
const Coffee = require('../models/coffee')
const { body, validationResult } = require('express-validator');


exports.brandList = function (req, res, next) {
    Brand.find({}, 'name description')
        .exec(function (err, brandList) {
            if (err) {
                return next(err)
            }
            res.render('brandList', { title: 'Current Brands', brandList })
        })
}


exports.brandDetail = function (req, res, next) {
    console.log("hi")
    async.parallel({
        brandItem: function (callback) {
            Brand.findById(req.params.id)
                .exec(callback)
        },
        brandCoffee: function (callback) {
            Coffee.find({ 'brand': req.params.id }, 'name description url')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err)
        }

        console.log(results.brandItem)
        res.render('brand_detail', { brandItem: results.brandItem, brandCoffee: results.brandCoffee })
    })
}

exports.brandCreateGet = function (req, res) {
    res.render('brandCreate')
}

exports.brandCreatePost = function (req, res, next) {
    let name = req.body.name
    let description = req.body.description
    console.log(description)
    let brand = new Brand({ name, description })
    brand.save(function (err) {
        if (err) {
            next(err)
            return
        }
        res.redirect('/catalog/brand')
    })
}




exports.brandUpdateGet = function (req, res, next) {

    Brand.findById(req.params.id)
        .exec(function (err, brand) {
            if (err) {
                return next(err)
            }
            res.render('brandCreate', { brand })
        })
}

exports.brandUpdatePost = [
    body('name', 'name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'description required').trim().isLength({ min: 1 }).escape(),

    function (req, res, next) {

        const errors = validationResult(req);

        let brand = new Brand({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        })


        if (!errors.isEmpty()) {
            console.log(errors)
            res.render('brandCreate', { brand, errors: errors.array() })

        } else {

            Brand.findByIdAndUpdate(req.params.id, brand, function (err, brandItem) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to book detail page.
                res.redirect(brandItem.url);
            });
        }
    }
]


exports.brandDeletePost = function (req, res, next) {
    async.parallel({
        brandItem: function (callback) {
            Brand.findById(req.params.id)
                .exec(callback)
        },
        brandCoffee: function (callback) {
            Coffee.find({ 'brand': req.params.id }, 'name description url')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err)
        }

        if (results.brandCoffee.length > 0) {
            res.render('brand_detail', { brandItem: results.brandItem, brandCoffee: results.brandCoffee, errors: "Associated Coffee must be deleted first" })
        } else {
            Brand.findByIdAndRemove(req.params.id, {}, function (err) {
                if (err) {
                    return next(err)
                }
                res.redirect('/catalog/brand');
            })
        }
    })
}


