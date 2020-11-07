let Brand = require('../models/brand')
let async = require('async')
const Coffee = require('../models/coffee')

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
            Coffee.find({'brand': req.params.id }, 'name description')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err)
        }

        console.log(results.brandItem)
        res.render('brand_detail', { brandItem : results.brandItem, brandCoffee : results.brandCoffee})
    })
}

exports.brandCreateGet = function (req, res) {
    res.render('brandCreate')
}

exports.brandCreatePost = function (req, res, next) {
    let name = req.body.name
    let description = req.body.description
    console.log(description)
    let brand = new Brand({name, description})
    brand.save(function(err) {
        if (err) {
            next(err)
            return
        } 
        res.redirect('/catalog/brand')
    })
}

exports.brandDeletePost = function (req, res, next) {
    Brand.findByIdAndRemove(req.params.id, {}, function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/catalog/brand');
    })
}