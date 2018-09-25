// batch-transactions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const {
        Schema
    } = mongooseClient;
    const batchTransactions = new Schema({
        batchNumber: {
            type: String,
            required: true
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        preQuantity: {
            type: Number,
            required: true
        }, // Before Operation.
        postQuantity: {
            type: Number,
            required: true
        }, // After Operation.
        quantity: {
            type: Number,
            require: true
        }, // Operational qty.
        comment: {
            type: String,
            require: false
        },
        referenceId: {
            type: String,
            required: false
        }, // Dispense id, Transfer id...
        referenceService: {
            type: String,
            required: false
        }, // Dispense, Transfer...
        inventorytransactionTypeId: {
            type: Schema.Types.ObjectId,
            require: false
        },
        productId: {
            type: Schema.Types.ObjectId,
            required: false
        },
        transactionId: {
            type: Schema.Types.ObjectId,
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
    }, {
        timestamps: true
    });

    return mongooseClient.model('batchTransactions', batchTransactions);
};