const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomCheckInSchema = new Schema({
  minorLocationId: { type: Schema.Types.ObjectId, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
  isDefault: { type: Schema.Types.Boolean, default: false },
  isOn: {type: Schema.Types.Boolean, default: false},
  lastLogin: { type: Date, 'default': Date.now }
});
module.exports = roomCheckInSchema;