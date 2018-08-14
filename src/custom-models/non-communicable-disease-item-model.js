const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nCDIModelSchema = new Schema({
    new_coronary_heart_disease    : { type: Number, required: false, 'default': 0 },
    new_diabetes_mellitus_case    : { type: Number, required: false, 'default': 0 },
    new_hypertension_case  : { type: Number, required: false, 'default': 0 },
    new_sickle_cell_disease_case : { type: Number, required: false, 'default': 0 },
    new_road_traffic_accident_case : { type: Number, required: false, 'default': 0 },
    new_home_accident_case : { type: Number, required: false, 'default': 0 },
    new_cases_of_snake_bites : { type: Number, required: false, 'default': 0 },
    new_cases_of_Asthma : { type: Number, required: false, 'default': 0 },
    new_arthritis  : { type: Number, required: false, 'default': 0 }
});
module.exports = nCDIModelSchema;