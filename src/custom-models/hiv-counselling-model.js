const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hivCoupleSchema = require('./hiv-couple-test-model');
const hivIndividualModel = require('./hiv-individual-model');
const coupleModelSchema = new Schema({
    individuals : hivIndividualModel,
    couples : hivCoupleSchema
});
module.exports = coupleModelSchema;
