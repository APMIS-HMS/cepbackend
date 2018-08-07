const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pmtctInfantItemModelSchema = new Schema({
    HIV_infectd_women_strtd_CP_witin_2mths : { type: Number, required: false, 'default': 0 },
    HIV_infectd_women_strtd_CP_2mths_n_abov : { type: Number, required: false, 'default': 0 },
    HIV_infectd_women_rcvd_HIV_test_witin_2mths_of_birth_DNA_PCR  : { type: Number, required: false, 'default': 0 },
    HIV_infectd_women_rcvd_HIV_test_aftr_2mths_of_birth_DNA_PCR : { type: Number, required: false, 'default': 0 },
    HIV_infectd_women_rcvd_HIV_test_at_18mths_HIV_Rapid_test  : { type: Number, required: false, 'default': 0 },
    HIV_infectd_women_testd_negativ_2_HIV_rapid_test_at_18mths : { type: Number, required: false, 'default': 0 },
    HIV_exposd_infants_brst_feedin_n_rcvin_HIV_prophylaxis : { type: Number, required: false, 'default': 0 }
});
module.exports = pmtctInfantItemModelSchema;