let mongoose = require("mongoose")

let Schema = mongoose.Schema;

let coffeeSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: String, 
    categories: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    price: Number,
    location: String,
    stock: Number
})

coffeeSchema
.virtual('url')
.get(function() {
    return '/catalog/coffee/' + this._id;
});

module.exports = mongoose.model('Coffee', coffeeSchema)