const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imciItemSchema = require('./imci-model');
const imciModelSchema = new Schema({
    Male  : imciItemSchema,
    Female   : imciItemSchema
});
module.exports = imciModelSchema;