const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inpatientAdminSchema = require('./inpatient-admission-item-model');
const inpatientAdmissionModelSchema = new Schema({
    Male  : inpatientAdminSchema,
    Female : inpatientAdminSchema
});
module.exports = inpatientAdmissionModelSchema;