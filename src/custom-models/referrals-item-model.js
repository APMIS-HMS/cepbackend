const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const referralsModelSchema = new Schema({
    referral_in   : { type: Number, required: false, 'default': 0 },
    referral_out   : { type: Number, required: false, 'default': 0 },
    malaria_cases_referred_for_further_treatment : { type: Number, required: false, 'default': 0 },
    malaria_cases_referred_for_adverse_drug_reaction   : { type: Number, required: false, 'default': 0 },
    women_seen_and_referred_for_Obstetric_Fistula_VVF_RVF : { type: Number, required: false, 'default': 0 }
});
module.exports = referralsModelSchema;