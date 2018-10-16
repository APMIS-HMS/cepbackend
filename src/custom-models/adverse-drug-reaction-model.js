const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adrmSchema = require('./adverse-drug-reaction-a-model');
const bdrmSchema = require('./adverse-drug-reaction-b-model');
const adrmModelSchema = new Schema({
    A : adrmSchema,
    B : bdrmSchema
});
module.exports = adrmModelSchema;