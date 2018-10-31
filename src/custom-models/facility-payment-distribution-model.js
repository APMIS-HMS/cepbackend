const mongoose = require('mongoose');
const paymentBeneficiarySchema = require('./payment-beneficiary-model');
const Schema = mongoose.Schema;

const facilityPaymentDistributionSchema = new Schema({
    percentage: { type: Schema.Types.Decimal128, default: 0 },
    transactions: [paymentBeneficiarySchema],
    description: { type: String, required: false }
}, {
    timestamps: true
});
module.exports = facilityPaymentDistributionSchema;