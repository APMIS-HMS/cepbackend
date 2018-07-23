const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const liveBirthItemSchema = require('./live-birth-item-model');
const tetanusItemModelSchema = new Schema({
    Male : liveBirthItemSchema,
    Female : liveBirthItemSchema
});
module.exports = tetanusItemModelSchema;
