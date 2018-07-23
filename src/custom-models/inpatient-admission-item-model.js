const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inpatientAdmissionItemModelSchema = new Schema({
    total_admission_0_28days  : { type: Number, required: false, 'default': 0 },
    total_admission_29d_11months : { type: Number, required: false, 'default': 0 },
    total_admission_12_59months  : { type: Number, required: false, 'default': 0 },
    total_admission_5_9years    : { type: Number, required: false, 'default': 0 },
    total_admission_10_19years  : { type: Number, required: false, 'default': 0 },
    total_admission_20years_and_above : { type: Number, required: false, 'default': 0 }
});
module.exports = inpatientAdmissionItemModelSchema;