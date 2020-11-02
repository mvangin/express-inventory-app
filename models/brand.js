let mongoose = require('mongoose');

let Schema = mongoose.Schema

let brandSchema = new Schema({
    name: {type: String, required: true, maxLength: 100, enum: ['Specialized', 'Santa Cruz', 'Public', 'Yuba'], default: 'Specialized'},
    description: String
})

brandSchema
.virtual("url")
.get(function() {
    return '/catalog/brand/' + this._id;
})


module.exports = mongoose.model("Brand", brandSchema)
