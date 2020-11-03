let Coffee = require('../models/coffee');
//let BikeInstance = require('../models/bikeInstance')

exports.coffeeList = function(req, res, err) {
    Coffee.find({}, 'name categories')
    .populate('categories')
    .exec(function(err, coffeeList) {
        if (err) {
            return next(err) 
        }
        res.render('coffeeList',{title: 'Coffee Inventory', coffeeList})
    })
}

exports.coffee_detail = function(req, res, err) {
    Coffee.findById(req.params.id)
    .populate('categories')
    .populate('brand')
    .exec(function(err, coffeeItem) {
        if (err) {
            return next(err) 
        }
        console.log(coffeeItem)
        res.render('coffee_detail',{coffeeItem})
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