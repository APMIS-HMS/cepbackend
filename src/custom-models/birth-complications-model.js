const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const complicationItemSchema = require('./birth-complications-item-model');
const still_birthModelSchema = new Schema({
    Male : complicationItemSchema,
    Female : complicationItemSchema
});
module.exports = still_birthModelSchema;
