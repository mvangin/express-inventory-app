let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bikeInstanceSchema = new Schema({
    bike: {type: Schema.Types.ObjectId, ref: 'Bike', required: true}
})

bikeInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bikeInstance/' + this._id;
});

module.exports = mongoose.model('BikeInstance', bikeInstanceSchema);


