#! /usr/bin/env node

console.log('This script populates some test bikes, categories, and brands to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Bike = require('./models/bike')
var Brand = require('./models/brand')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = []
var categories = []
var bikes = []

function brandCreate(name, description, cb) {

  let brand = new Brand({name, description})
       
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function categoryCreate(name, cb) {
  let category = new Category({name})
  category.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log("new category: " + category)
    categories.push(category);
    cb(null,category)
  })
}


function bikeCreate(name, description, color, categories, brand, price, cb) {
  let bike = new Bike({name, description, color, categories, brand, price})
  bike.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log("new bike: " + bike)
    bikes.push(bike);
    cb(null,bike)
  })

}

function brandCreateSeries(cb) {
    async.series([
        function(callback) {
          brandCreate('Specialized', 'this is the main brand', callback);
        },
        function(callback) {
          brandCreate('Santa Cruz', 'this is the second brand', callback);
        },
        ],

        // optional callback
        cb);
}

function categoryCreateSeries(cb) {
  async.series([
      function(callback) {
        categoryCreate('Mountain Bike', callback);
      },
      function(callback) {
        categoryCreate('Road bike', callback);
      },
      ],
      // optional callback
      cb);
}

function bikeCreateSeries(cb) {
  async.series([
      function(callback) {
        bikeCreate('Aethos', 'Newest and greatest', 'Amber', categories[0], brands[0], 10000, callback);
      },
      function(callback) {
        bikeCreate('Stump jumper', 'Best in business', 'black', categories[1], brands[1], 3000, callback);
      },
      ],
      // optional callback
      cb);
}



async.series([
    brandCreateSeries,
    categoryCreateSeries,
    bikeCreateSeries
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('FULL BRANDS LIST: \n' + brands);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




