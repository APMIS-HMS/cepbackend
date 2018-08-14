const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const infantModel = require('./pmtct-infant-item-model');
const pmtctModelSchema = new Schema({
  male: infantModel,
  female: infantModel
});
module.exports = pmtctModelSchema;