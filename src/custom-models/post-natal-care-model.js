const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postNatalCareSchema = new Schema({
    total_attendance : { type: Number, required: false,'default': 0 },
    postnatal_clinic_visits_within_1_day_of_delivery : { type: Number, required: false,'default': 0 },
    postnatal_clinic_visits_within_3_days_of_delivery : { type: Number, required: false,'default': 0 },
    postnatal_clinic_visits_7_days_of_delivery : { type: Number, required: false,'default': 0 },
});
module.exports = postNatalCareSchema;