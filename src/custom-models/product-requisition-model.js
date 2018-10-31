const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requisitionSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, require: true },
  productObject: { type: Schema.Types.Mixed, require: true },
  qtyDetails:[{ type: Schema.Types.Mixed, require: true }],
  qty: { type: Number, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = requisitionSchema;