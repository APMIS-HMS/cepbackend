const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorizationSchema = new Schema({
    authorization_code: { type: String},
    bin: { type: String},
    last4: { type: String },
    exp_month: { type: String },
    exp_year: { type: String },
    channel: { type: String },
    card_type: { type: String },
    bank: { type: String },
    country_code: { type: String },
    brand: { type: String },
    reusable: { type: Boolean },
    signature: { type: String }
});
module.exports = authorizationSchema;