const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genderTestResultModel = require('./hiv-individual-type-model');
const genderTestResultModelSchema = new Schema({
    male  : genderTestResultModel,
    female : genderTestResultModel
});
module.exports = genderTestResultModelSchema;
