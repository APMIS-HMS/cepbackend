// inventoryTransfers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const inventorytransferTransactionSchema = require('../custom-models/inventory-transfer-transaction-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const inventoryTransfers = new Schema({
        facilityId: { type: Schema.Types.ObjectId, require: [true,'Facility Id not supplied or Invalid'], index: true },
        storeId: { type: Schema.Types.ObjectId, require: [true,'Store Id not supplied or Invalid'] },
        destinationStoreId: { type: Schema.Types.ObjectId, require: [true,'Destination store not supplied or invalid'] },
        inventorytransactionTypeId: { type: Schema.Types.ObjectId, require: [true,'invalid inventory transaction type'] },
        transferBy: { type: Schema.Types.ObjectId, require: [true,'Initialiser of the transaction not defined'] },
        inventoryTransferTransactions: [inventorytransferTransactionSchema],
        totalCostPrice: { type: Number }
    }, {
        timestamps: true
    });

    return mongooseClient.model('inventoryTransfers', inventoryTransfers);
};
