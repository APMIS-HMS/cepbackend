const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inpatientAdmissionItemModelSchema = new Schema({
    prescriptions_issued : { type: Number, required: false, 'default': 0 },
    items_dispensed : { type: Number, required: false, 'default': 0 },
    antibiotics_prescribed : { type: Number, required: false, 'default': 0 },
    injectables_prescribed : { type: Number, required: false, 'default': 0 }
});
module.exports = inpatientAdmissionItemModelSchema;