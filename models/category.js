let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
    name: {type:String, required: true, maxLength: 100, enum: ['Light Roast', 'Medium Roast', 'Dark Roast', 'Espresso'], default: "Medium Roast"}
})


CategorySchema
.virtual('url')
.get(function() {
    return '/catalog/category/' + this._id;
})

module.exports = mongoose.model('Category', CategorySchema);