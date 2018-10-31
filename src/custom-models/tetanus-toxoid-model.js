const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tetanusToxoidItemModelSchema = require('./tetanus-toxoid-item-model');
const tetanusToxoidSchema = new Schema({
    pregnant : tetanusToxoidItemModelSchema,
    non_pregnant : tetanusToxoidItemModelSchema
});
module.exports = tetanusToxoidSchema;