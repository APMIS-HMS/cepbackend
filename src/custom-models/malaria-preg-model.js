const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const malariaPregModelSchema = new Schema({
    clinical_malaria  : { type: Number, required: false, 'default': 0 },
    malaria_confirmed_preg_women : { type: Number, required: false, 'default': 0 }
});
module.exports = malariaPregModelSchema;