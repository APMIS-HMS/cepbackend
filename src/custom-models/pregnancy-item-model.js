const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stillItemSchema = require('./still-births-model');
const liveItemSchema = require('./live-birth-model');
const complicationItemSchema = require('./birth-complications-model');
const pregnancyItemModelSchema = new Schema({
    still_birth : stillItemSchema,
    live_birth_fresh : liveItemSchema,
    complication : complicationItemSchema
});
module.exports = pregnancyItemModelSchema;