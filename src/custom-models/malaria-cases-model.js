const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const malariaCasesModelSchema = new Schema({
    persons_wit_clincaly_diagnsd_malaria_LT_5yrs  : { type: Number, required: false, 'default': 0 },
    persons_wit_clincaly_diagnsd_malaria_GTE_5yrs  : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmd_uncomplictd_malaria_LT_5yrs  : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmd_uncomplictd_malaria_GTE_5yrs : { type: Number, required: false, 'default': 0 },
    persons_wit_severe_malaria_LT_5yrs  : { type: Number, required: false, 'default': 0 },
    persons_wit_severe_malaria_GTE_5yrs  : { type: Number, required: false, 'default': 0 }
});
module.exports = malariaCasesModelSchema;