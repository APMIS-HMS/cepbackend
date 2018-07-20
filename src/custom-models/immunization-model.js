const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const immunizationItemsSchema = require('./immunization-items-model');
const immunizationModelSchema = new Schema({
    fixed  : immunizationItemsSchema,
    outreach  : immunizationItemsSchema
});
module.exports = immunizationModelSchema;