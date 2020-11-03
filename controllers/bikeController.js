let Bike = require('../models/bike');
let BikeInstance = require('../models/bikeInstance')

exports.bikeList = function(req, res, err) {
    Bike.find({}, 'name categories')
    .populate('categories')
    .exec(function(err, bikeList) {
        if (err) {
            return next(err) 
        }
        res.render('bikeList',{title: 'Bike list', bikeList})
    })
}

exports.bikeInstance = function(req,res,err) {
    BikeInstance.find({}, 'bike')
    .populate('bike')
    .exec(function(err, bikeInstances) {
        if (err){
            return next(err)
        }

        res.render('bikeInstances',{title: 'Bike instance List', bikeInstances})
    })
}
