const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const documentationAuthorizationSchema = new Schema({
    documentationAuthorizationCode: { type: Schema.Types.String, required: true },
    expires: { type: Schema.Types.Date, required: true },
    attempts: [{ type: Schema.Types.Date, required: false }],
    lastAttempt: { type: Schema.Types.Date, required: false },
    tryAgainAt: { type: Schema.Types.Date, required: false }
}, { timestamps: true });
module.exports = documentationAuthorizationSchema;