const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutritionItemSchema = require('./nutrition-item-model');
const nutritionModelSchema = new Schema({
    Male  : nutritionItemSchema,
    Female  : nutritionItemSchema
});
module.exports = nutritionModelSchema;