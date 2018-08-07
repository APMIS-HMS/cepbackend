const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const motherModel = require('./pmtct-mother-item-model');
const infantModel = require('./pmtct-infant-model');
const pmtctModelSchema = new Schema({
  mother: motherModel,
  infant: infantModel
});
module.exports = pmtctModelSchema;