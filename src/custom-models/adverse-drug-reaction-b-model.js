const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inpatientAdmissionItemModelSchema = new Schema({
    antimalarials_health_facility_with_mobile_authentification_with_Scratch_Card  : { type: Number, required: false, 'default': 0 },
    antimalarials_health_facility_with_mobile_authentification_without_Scratch_Card  : { type: Number, required: false, 'default': 0 }
});
module.exports = inpatientAdmissionItemModelSchema;