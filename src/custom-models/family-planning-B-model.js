const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imciItemModelSchema = new Schema({
    female_15_49_years_using_modern_contraceptives : { type: Number, required: false, 'default': 0 },
    persons_given_oral_pills : { type: Number, required: false, 'default': 0 },
    oral_pill_cycle_packets : { type: Number, required: false, 'default': 0 },
    injectables_given : { type: Number, required: false, 'default': 0 },
    IUCD_inserted  : { type: Number, required: false, 'default': 0 },
    implant : { type: Number, required: false, 'default': 0 },
    sterilization_total  : { type: Number, required: false, 'default': 0 },
    male_condoms_distributed : { type: Number, required: false, 'default': 0 },
    female_condoms_distributed  : { type: Number, required: false, 'default': 0 },
    individual_referred_for_FP_services_from_PMTCT_HIV_plus_Pregnant_Women : { type: Number, required: false, 'default': 0 }
});
module.exports = imciItemModelSchema;