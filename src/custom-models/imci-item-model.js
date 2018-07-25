const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imciItemModelSchema = new Schema({
    diarrhoea_less_than_5years_new_case  : { type: Number, required: false, 'default': 0 },
    diarrhoea_less_than_5years_new_case_given_oral_rehydration_preparaions   : { type: Number, required: false, 'default': 0 },
    diarrhoea_less_than_5years_new_case_given_ORS_zinc  : { type: Number, required: false, 'default': 0 },
    pneumonia_less_than_5years_new_case  : { type: Number, required: false, 'default': 0 },
    pneumonia_new_cases_less_than_5years_given_antibiotics_amoxyl_DT : { type: Number, required: false, 'default': 0 },
    measles_less_than_5years_new_case  : { type: Number, required: false, 'default': 0 }
});
module.exports = imciItemModelSchema;