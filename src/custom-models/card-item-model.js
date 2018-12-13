const mongoose = require('mongoose');
const authorization = require('./authorization-item-model');
const customer = require('./customer-card-details-model');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    authorization: authorization,
    customer: customer,
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = cardSchema;