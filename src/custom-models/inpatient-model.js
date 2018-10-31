const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nCDIModelSchema = new Schema({
    functional_beds : { type: Number, required: false, 'default': 0 },
    inpatient_days_Total : { type: Number, required: false, 'default': 0 },
    inpatient_discharges_total : { type: Number, required: false, 'default': 0 }
});
module.exports = nCDIModelSchema;