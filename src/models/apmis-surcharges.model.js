// apmis-surcharges-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const apmisSurcharges = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    value: { type: Number, required: true },
    invoiceTotalSurcharge: { type: Number, required: true },
    isSurchargeCompleted:{ type: Boolean, required: true,'default': false },
    deductedValue: { type: Number, required: true },
    isPercentage: { type: Boolean, required: true,'default': true },
    disbursed: { type: Boolean, required: true,'default': false },
    disbursedBy: { type: Schema.Types.ObjectId, required: false },
    disbursedAt: { type: Date, required: false},
    invoiceId: { type: Schema.Types.ObjectId, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('apmisSurcharges', apmisSurcharges);
};
