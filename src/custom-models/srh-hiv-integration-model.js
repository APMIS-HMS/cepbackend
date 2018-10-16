const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hivIntegrationModel = require('./srh-hiv-integration-item-model');
const hivIntegrationModelSchema = new Schema({
  male: hivIntegrationModel,
  female: hivIntegrationModel
});
module.exports = hivIntegrationModelSchema;