const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const malariaTestModelSchema = new Schema({
    fever_cases_LT_5yrs : { type: Number, required: false, 'default': 0 },
    fever_cases_GTE_5yrs : { type: Number, required: false, 'default': 0 },
    fever_tested_by_RDT_LT_5yrs : { type: Number, required: false, 'default': 0 },
    fever_tested_b_RDT_GTE_5yrs : { type: Number, required: false, 'default': 0 },
    malaria_RDT_tested_postiv_LT_5yrs : { type: Number, required: false, 'default': 0 },
    malaria_RDT_tested_postiv_GTE_5yrs  : { type: Number, required: false, 'default': 0 },
    fever_tested_by_mcrscopy_4_malaria_parasites_LT_5yrs : { type: Number, required: false, 'default': 0 },
    fever_tested_by_mcrscopy_4_malaria_parasites_GTE_5yrs : { type: Number, required: false, 'default': 0 },
    malaria_mcrscopy_tested_postiv_LT_5yrs : { type: Number, required: false, 'default': 0 },
    fever_tested_by_mcrscopy_4_malaria_parasites_LT_5yrs   : { type: Number, required: false, 'default': 0 },
    fever_tested_by_mcrscopy_4_malaria_parasites_GTE_5yrs  : { type: Number, required: false, 'default': 0 },
    malaria_mcrscopy_tested_postiv_LT_5yrs   : { type: Number, required: false, 'default': 0 },
    malaria_mcrscopy_tested_postiv_GTE_5yrs  : { type: Number, required: false, 'default': 0 }
});
module.exports = malariaTestModelSchema;