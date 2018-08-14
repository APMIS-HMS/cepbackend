const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postNatalASchema = require('./post-natal-care-model');
const anteNatalSchema = require('./ante-natal-care-model');

const antePostNatalCareSchema = new Schema({
    Antenatal : anteNatalSchema,
    Postnatal : postNatalASchema,
});
module.exports = antePostNatalCareSchema;