// schedules-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const scheduleItemSchema = require('../custom-models/schedule-item-model');
  const schedules = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    schedulerType: { type: Schema.Types.String, required: true },
    clinicObject: { type: Schema.Types.ObjectId, required: true },
    schedules: [scheduleItemSchema],
  }, {
    timestamps: true
  });

  return mongooseClient.model('schedules', schedules);
};
