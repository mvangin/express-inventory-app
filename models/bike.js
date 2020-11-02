let mongoose = require("mongoose")

let Schema = mongoose.Schema;

let bikeSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: String, 
    color: {type: String, required: true, maxLength: 100},
    categories: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    price: Number
})

bikeSchema
.virtual('url')
.get(function() {
    return '/catalog/bike/' + this._id;
});

module.exports = mongoose.model('Bike', bikeSchema)