const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentationAuthorizationSchema = new Schema({
    documentationAuthorizationCode: { type: Schema.Types.String, required: true },
    expires: { type: Schema.Types.Date, required: true },
    attempts: [{ type: Schema.Types.Date, required: false }],
    lastAttempt: { type: Schema.Types.Date, required: false },
    tryAgainAt: { type: Schema.Types.Date, required: false },
    employeeId: { type: Schema.Types.ObjectId, required: true },
    facilityId: { type: Schema.Types.ObjectId, required: true },
    verified: { type: Schema.Types.Boolean, required: false, default: false }
}, { timestamps: true });
module.exports = documentationAuthorizationSchema;