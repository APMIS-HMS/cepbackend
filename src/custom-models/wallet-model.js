const mongoose = require('mongoose');
const transactionSchema = require('./wallet-transaction-model');
const card = require('./card-item-model');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  balance: { type: Schema.Types.Number, default:0 },
  ledgerBalance: { type: Schema.Types.Number, default:0 },
  transactions: [ transactionSchema],
  cards:[card],
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = walletSchema;