const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const still_birthModelSchema = new Schema({
    still_birth : { type: Number, required: false, 'default': 0 },
    still_birth_fresh : { type: Number, required: false, 'default': 0 },
    abortions_induced : { type: Number, required: false, 'default': 0 },
    abortions_total : { type: Number, required: false, 'default': 0 }
});
module.exports = still_birthModelSchema;