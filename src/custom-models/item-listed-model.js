const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    'default': Date.now
  },
  updatedAt: {
    type: Date,
    'default': Date.now
  },
  productConfiguration: {
    type: Schema.Types.Mixed,
    required: false
  },
});
module.exports = orderSchema;
