const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentBeneficiarySchema = new Schema({
    accountName: { type: Schema.Types.String, required: true },
    accountNumber: { type: Schema.Types.String, required: true },
    bankId: { type: Schema.Types.ObjectId, required: true },
    bankSortCode: { type: Schema.Types.String, required: true },
    percentage: { type: Schema.Types.Decimal128, default: 0 }
}, {
    timestamps: true
});
module.exports = paymentBeneficiarySchema;