const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NCDIItemSchema = require('./non-communicable-disease-item-model');
const NCDIModelSchema = new Schema({
    Male : NCDIItemSchema,
    Female : NCDIItemSchema
});
module.exports = NCDIModelSchema;