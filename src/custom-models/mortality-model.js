const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mortalityItemSchema = require('./mortality-item-model');
const mmA = require('./maternal-mortality_A-model');
const mmB = require('./maternal-mortality_B-model');
const under5 = require('./under5-mortality-model');
const mortalityItemModelSchema = new Schema({
  Male: mortalityItemSchema,
  Female: mortalityItemSchema,
  maternalMortality_A: mmA,
  maternalMortality_B: mmB,
  under5Mortality: under5
});
module.exports = mortalityItemModelSchema;
