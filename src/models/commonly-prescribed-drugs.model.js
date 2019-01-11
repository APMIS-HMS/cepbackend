// commonly-prescribed-drugs-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const commonlyPrescribedDrugs = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    personId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    locationId: {
      type: Schema.Types.ObjectId,
      required: false
    },
    productObject: {
      type: Schema.Types.Mixed,
      required: true
    },
  }, {
    timestamps: true
  });

  return mongooseClient.model('commonlyPrescribedDrugs', commonlyPrescribedDrugs);
};
