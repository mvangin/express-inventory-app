let Brand = require('../models/brand')
let async = require('async')
const Coffee = require('../models/coffee')

exports.brandList = function (req, res, err) {
    Brand.find({}, 'name description')
        .exec(function (err, brandList) {
            if (err) {
                return next(err)
            }
            res.render('brandList', { title: 'Current Brands', brandList })
        })
}


exports.brandDetail = function (req, res, err) {
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
