#! /usr/bin/env node

console.log('This script populates some test coffee, categories, and brands to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Coffee = require('./models/coffee')
var Brand = require('./models/brand')
var Category = require('./models/category')
var BikeInstance = require('./models/bikeInstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = []
var categories = []
var coffees = []
//var bikeInstances = []

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
  });
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


function coffeeCreate(name, description, categories, brand, price, location, stock, cb) {
  let coffee = new Coffee({name, description, categories, brand, price, location, stock})
  coffee.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log("new coffee: " + coffee)
    coffees.push(coffee);
    cb(null,coffee)
  })
}

/*
function bikeInstanceCreate(bike, cb) {
  let bikeInstance = new BikeInstance({bike})
  bikeInstance.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log("new bikeInstance: " + bikeInstance)
    bikeInstances.push(bikeInstance);
    cb(null,bikeInstance)
  })
}
*/

function brandCreateSeries(cb) {
    async.parallel([
        function(callback) {
          brandCreate('Dana Street Roasting', 'this is the main brand', callback);
        },
        function(callback) {
          brandCreate('Verve Coffee Roasting', 'this is the second brand', callback);
        },
        ],

        // optional callback
        cb);
}

function categoryCreateSeries(cb) {
  async.parallel([
      function(callback) {
        categoryCreate('Light Roast', callback);
      },
      function(callback) {
        categoryCreate('Dark Roast', callback);
      },
      ],
      // optional callback
      cb);
}


function coffeeCreateSeries(cb) {
  async.parallel([
      function(callback) {
        coffeeCreate('Columbia smoky fluff', 'velvety smooth ground coffee', categories[0], brands[0], 20, 'Mountain View', 10, callback);
      },
      function(callback) {
        coffeeCreate('Panama lush rain', 'velvety smooth ground coffee2', categories[1], brands[1], 25, 'san Jose', 30, callback);
      },
      ],
      // optional callback
      cb);
}

/* function bikeInstanceCreateSeries(cb) {
  async.parallel([
      function(callback) {
        bikeInstanceCreate(coffees[0], callback);
      },
      function(callback) {
        bikeInstanceCreate(coffees[0], callback);
      },
      function(callback) {
        bikeInstanceCreate(coffees[0], callback);
      },
      function(callback) {
        bikeInstanceCreate(coffees[1], callback);
      },
      ],

      // optional callback
      cb);
}
*/

async.series([
    brandCreateSeries,
    categoryCreateSeries,
    coffeeCreateSeries,
    //bikeInstanceCreateSeries
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




