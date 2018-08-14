const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const labourDeliverySchema = require('./labour-delivery-model');
const antePostNatalSchema = require('./ante-post-natal-care-model');

const MaternalHealthSchema = new Schema({
    Ante_and_Post_natal_Care : antePostNatalSchema,
    Labour_and_Delivery : labourDeliverySchema,
});
module.exports = MaternalHealthSchema;