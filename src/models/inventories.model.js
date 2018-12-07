// inventories-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const inventoryTransactionSchema = require('../custom-models/inventory-transaction-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const inventories = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      require: [true, 'Facility Id not supplied or Invalid'],
      index: true
    },
    storeId: {
      type: Schema.Types.ObjectId,
      require: [true, 'Invalid store Id'],
      index: true
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      require: false
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      require: false
    },
    facilityServiceId: {
      type: Schema.Types.ObjectId,
      require: false
    },
    productId: {
      type: Schema.Types.ObjectId,
      require: [true, 'Invalid product Id'],
      index: true
    },
    productObject: {
      type: Schema.Types.Mixed,
      require: true,
      index: true
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity (Number) field is required.']
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quntity (Number) field must not be empty.']
    },
    reorderLevel: {
      type: Number,
      required: false
    },
    reorderQty: {
      type: Number,
      required: false
    },
    margin: {
      type: Number,
      required: false
    },
    transactions: [inventoryTransactionSchema]
  }, {
    timestamps: true
  });

  return mongooseClient.model('inventories', inventories);
};
