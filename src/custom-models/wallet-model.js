const mongoose = require('mongoose');
const transactionSchema = require('./wallet-transaction-model');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  balance: { type: Schema.Types.Number, default:0 },
  ledgerBalance: { type: Schema.Types.Number, default:0 },
  transactions: [ transactionSchema],
  cards:[{ type: Schema.Types.Mixed, default:0 }],
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = walletSchema;