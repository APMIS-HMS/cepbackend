const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pmtctMotherItemModelSchema = new Schema({
    preg_women_testd_HIV_positiv   : { type: Number, required: false, 'default': 0 },
    ANC_women_wit_prevly_knwn_HIV_status_At_ANC  : { type: Number, required: false, 'default': 0 },
    preg_women_rcvd_HIV_counselin_testing_n_rcvd_reslts_at_ANC : { type: Number, required: false, 'default': 0 },
    preg_women_rcvd_HIV_counselin_testing_n_rcvd_rslts_LnD : { type: Number, required: false, 'default': 0 },
    women_rcvd_HIV_counselin_testin_n_rcvd_rslts_PNC : { type: Number, required: false, 'default': 0 },
    partners_of_HIV_pos_preg_women_tested_HIV_negtiv : { type: Number, required: false, 'default': 0 },
    partners_of_HIV_postiv_preg_women_tested_HIV_postiv : { type: Number, required: false, 'default': 0 },
    partners_of_HIV_negtiv_preg_women_tested_HIV_postiv : { type: Number, required: false, 'default': 0 },
    partners_of_HIV_negtiv_preg_women_tested_HIV_negativ : { type: Number, required: false, 'default': 0 },
    HIV_postiv_preg_women_assessd_4_ART_elig_eith_clincl_stge_or_CD4 : { type: Number, required: false, 'default': 0 },
    preg_HIV_postiv_woman_rcvd_ARV_prophylaxis_4_PMTCT_Triple : { type: Number, required: false, 'default': 0 },
    preg_HIV_postiv_woman_rcvd_ARV_prophylaxis_4_PMTCT_SdNVP_in_Labor : { type: Number, required: false, 'default': 0 },
    preg_HIV_postiv_woman_rcvd_ARV_prophylaxis_4_PMTCT_AZT : { type: Number, required: false, 'default': 0 },
    preg_HIV_postiv_woman_rcvd_ARV_prophylaxis_4_PMTCT_SdNVP_in_Labor_only : { type: Number, required: false, 'default': 0 },
    preg_HIV_postiv_woman_rcvd_ARV_prophylaxis_4_PMTCT_Total : { type: Number, required: false, 'default': 0 },
});
module.exports = pmtctMotherItemModelSchema;