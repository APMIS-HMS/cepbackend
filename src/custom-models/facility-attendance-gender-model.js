const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faciltyAttendanceGenderSchema = new Schema({
    _0_28_days: { type: Number, required: false,'default': 0 },
    _29d_11_months : { type: Number, required: false,'default': 0 },
    _12_59_months : { type: Number, required: false,'default': 0 },
    _5_9_years : { type: Number, required: false,'default': 0 },
    _10_19_years : { type: Number, required: false,'default': 0 },
    _20_above_years : { type: Number, required: false,'default': 0 },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = faciltyAttendanceGenderSchema;