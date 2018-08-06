const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const malariaCasesModelSchema = new Schema({
    persons_wit_confirmed_uncmplictd_malaria_rcvin_ACT_LT_5yrs   : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmed_uncmplictd_malaria_rcvin_ACT_GTE_5yrs  : { type: Number, required: false, 'default': 0 },
    persons_treated_wit_ACT_on_basis_clincal_diagnsis_only_LT_5yrs   : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmd_uncomplictd_malaria_GTE_5yrs : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmd_uncomplictd_malaria_treated_wit_other_antimalarials_LT_5yrs   : { type: Number, required: false, 'default': 0 },
    persons_wit_confirmd_uncomplictd_malaria_treated_wit_other_antimalarials_GTE_5yrs  : { type: Number, required: false, 'default': 0 }
});
module.exports = malariaCasesModelSchema;