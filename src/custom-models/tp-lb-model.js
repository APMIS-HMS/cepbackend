const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tpModel = require('./tp-lb-item-model');
const tpModelSchema = new Schema({
  male: tpModel,
  female: tpModel
});
module.exports = tpModelSchema;