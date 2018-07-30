const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inpatientAdmissionItemModelSchema = new Schema({
    adverse_drug_reactions_ADRs_reported_following_immunization : { type: Number, required: false, 'default': 0 },
    adverse_drug_reactions_ADRs_reported_following_use_of_antiretrovirals : { type: Number, required: false, 'default': 0 },
    adverse_drug_reactions_ADRs_reported_following_use_of_antimalarials : { type: Number, required: false, 'default': 0 }
});
module.exports = inpatientAdmissionItemModelSchema;