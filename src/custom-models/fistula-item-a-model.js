const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fistulaItemAModelSchema = new Schema({
    reported_leaking_urine_or_faeces : { type: Number, required: false, 'default': 0 }
});
module.exports = fistulaItemAModelSchema;