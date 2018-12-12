// purchase-list-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const itemListed = require('../custom-models/item-listed-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const purchaseList = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    purchaseListNumber: {
      type: String,
      required: false
    },
    suppliersId: [{
      type: Schema.Types.Mixed,
      required: false
    }],
    storeId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true
    },

    listedProducts: [itemListed],
    isActive: {
      type: Boolean,
      'default': true
    },
    isDraft: {
      type: Boolean,
      'default': true
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('purchaseList', purchaseList);
};
