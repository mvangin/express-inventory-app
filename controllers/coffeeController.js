let Coffee = require('../models/coffee');
const { body, validationResult } = require('express-validator')
//let BikeInstance = require('../models/bikeInstance')

exports.coffeeList = function (req, res, err) {
    Coffee.find({}, 'name categories')
        .populate('categories')
        .exec(function (err, coffeeList) {
            if (err) {
                return next(err)
            }
            res.render('coffeeList', { title: 'Coffee Inventory', coffeeList })
        })
}

exports.coffeeDetail = function (req, res, err) {
    Coffee.findById(req.params.id)
        .populate('categories')
        .populate('brand')
        .exec(function (err, coffeeItem) {
            if (err) {
                return next(err)
            }
            console.log(coffeeItem)
            res.render('coffee_detail', { coffeeItem })
        })
}


exports.coffeeUpdateGet = function (req, res, err) {
    Coffee.findById(req.params.id)
        .populate('categories')
        .populate('brand')
        .exec(function (err, coffeeItem) {
            if (err) {
                return next(err)
            }
            console.log(coffeeItem)
            res.render('coffeeUpdateForm', { coffeeItem })
        })
}


exports.coffeeUpdatePost = function (req, res, err) {
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



exports.coffeeDeletePost = function (req, res, err) {
    console.log(req.params.id)
    Coffee.findByIdAndRemove(req.params.id, {}, function (err) {
        if (err) {
            return next(err)
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