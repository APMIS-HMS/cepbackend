const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requisitionSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, require: true },
  productObject: { type: Schema.Types.Mixed, require: true },
  quantityRequested: { type: Number, required: false },
  availableQuantity: { type: Number, required: false },
  quantityOnHold: { type: Number, required: false },
  quantityGiven: { type: Number,'default': 0 },
  baseUnit: { type: String,require: true },
  status:{ type: String,'default': 'Pending' },
  serviceId: { type: Schema.Types.ObjectId, require: false },
  categoryId: { type: Schema.Types.ObjectId, require: false },
  facilityServiceId: { type: Schema.Types.ObjectId, require: false },
  transactionId: { type:Schema.Types.ObjectId, require: true},
  costPrice: { type: Number, required: false },
  iscompleted: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = requisitionSchema;