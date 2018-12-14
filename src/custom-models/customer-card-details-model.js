const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerCardSchema = new Schema({
    id: { type: Number },
    first_name: { type: String },
    last_name: { type: String},
    email: { type: String},
    customer_code: { type: String},
    phone: { type: String},
    metadata: { type: Schema.Types.Mixed },
    risk_action: { type: Schema.Types.Mixed}
});
module.exports = customerCardSchema;