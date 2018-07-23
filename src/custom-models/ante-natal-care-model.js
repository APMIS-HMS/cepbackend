const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anteNatalCareSchema = new Schema({
    total_attendance : { type: Number, required: false,'default': 0 },
_1st_booking_visit_before_20_weeks : { type: Number, required: false,'default': 0 },
_1st_booking_visit_20_weeks_or_later : { type: Number, required: false,'default': 0 },
_pregnant_women_that_attended_antenatal_clinic_for_4th_visit_during_the_month : { type: Number, required: false,'default': 0 },
ANC_syphilis_test_done : { type: Number, required: false,'default': 0 },
ANC_syphilis_test_positive : { type: Number, required: false,'default': 0 },
ANC_Syphilis_case_treated : { type: Number, required: false,'default': 0 },
pregnant_women_who_received_malaria_IPT1 : { type: Number, required: false,'default': 0 },
pregnant_women_who_received_malaria_IPT2 : { type: Number, required: false,'default': 0 },
pregnant_women_receiving_LLIN : { type: Number, required: false,'default': 0 },
pregnant_women_receiving_haematinics : { type: Number, required: false,'default': 0 },
});
module.exports = anteNatalCareSchema;