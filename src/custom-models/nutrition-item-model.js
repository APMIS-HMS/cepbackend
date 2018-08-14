const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutritionItemModelSchema = new Schema({
    _0_59_months_weighed : { type: Number, required: false, 'default': 0 },
    _0_59_months_weighing_below_bottomline  : { type: Number, required: false, 'default': 0 },
    _0_6_months_exclusivelly_breastfed : { type: Number, required: false, 'default': 0 },
    _6_11_months_given_vitamin_A : { type: Number, required: false, 'default': 0 },
    _12_59_months_given_vitamin_A : { type: Number, required: false, 'default': 0 },
    _12_59_months_given_deworming_medication : { type: Number, required: false, 'default': 0 },
    _less_than_5_years_discharged_as_healthy_from_treatment_for_severe_acute_malnutrition_Recovered : { type: Number, required: false, 'default': 0 },
    child_admitted_into_CMAM_program : { type: Number, required: false, 'default': 0 },
    child_defaulted_from_CMAM_program : { type: Number, required: false, 'default': 0 }
});
module.exports = nutritionItemModelSchema;
