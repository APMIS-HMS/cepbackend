const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const malariaTestModel = require('./malaria-test-item-model');
const malariaPregModel = require('./malaria-preg-model');
const malariaCasesModel = require('./malaria-cases-model');
const malariaTreatmentModel = require('./malaria-treatment-model');
const malariaModelSchema = new Schema({
    malariaTest : malariaTestModel,
    malariaPreg : malariaPregModel,
    malariaCases : malariaCasesModel,
    malariaTreatment : malariaTreatmentModel

});
module.exports = malariaModelSchema;