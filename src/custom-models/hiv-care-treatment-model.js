const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hivCareModel = require('./hiv-care-treatment-item-model');
const hivCareModelSchema = new Schema({
  male: hivCareModel,
  female: hivCareModel
});
module.exports = hivCareModelSchema;