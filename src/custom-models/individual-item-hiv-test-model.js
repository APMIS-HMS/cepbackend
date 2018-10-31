const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const totalDeathsItemModelSchema = new Schema({
    less_than_2years: { type: Number, required: false, 'default': 0 },
    _2_to_14years : { type: Number, required: false, 'default': 0 },
    _15_to_19years : { type: Number, required: false, 'default': 0 },
    _20_to_24years : { type: Number, required: false, 'default': 0 },
    _25_to_49years : { type: Number, required: false, 'default': 0 },
    _15_to_19years : { type: Number, required: false, 'default': 0 },
    _50plus_years : { type: Number, required: false, 'default': 0 }
});
module.exports = totalDeathsItemModelSchema;
