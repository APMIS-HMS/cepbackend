const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tbCasesItemModelSchema = new Schema({
    tb_cases_all_forms_notified_0_to_4yrs : { type: Number, required: false, 'default': 0 },
    tb_cases_all_forms_notified_5_15yrs : { type: Number, required: false, 'default': 0 },
    tb_cases_all_forms_notified_GT_15yrs_tb_LP : { type: Number, required: false, 'default': 0 },
    tb_cases_succssfully_treatd_among_all_forms_cured_n_compltd_0_to_4yrs : { type: Number, required: false, 'default': 0 },
    tb_cases_succssfully_treatd_among_all_forms_cured_n_compltd_5_to_15yrs : { type: Number, required: false, 'default': 0 },
    tb_cases_succssfully_treatd_among_all_forms_cured_n_compltd_GT_15yrs_tb_lp  : { type: Number, required: false, 'default': 0 },
    suspects_scrnd_4_tb_0_to_4yrs : { type: Number, required: false, 'default': 0 },
    suspects_scrnd_4_tb_5_15yrs : { type: Number, required: false, 'default': 0 },
    suspects_scrnd_4_tb_GT_15yrs_tb_lp : { type: Number, required: false, 'default': 0 },
    dr_tb_suspects_tested_4_dr_tb_0_to_4yrs  : { type: Number, required: false, 'default': 0 },
    dr_tb_suspects_tested_4_dr_tb_5_to_15yrs  : { type: Number, required: false, 'default': 0 },
    dr_tb_suspects_tested_4_dr_tb_GT_15yrs_tb_lp  : { type: Number, required: false, 'default': 0 },
    confirmed_dr_tb_patients_enroled_4_trtmnt_0_to_4yrs  : { type: Number, required: false, 'default': 0 },
    confirmed_dr_tb_patients_enroled_4_trtmnt_5_to_15yrs  : { type: Number, required: false, 'default': 0 },
    confirmed_dr_tb_patients_enroled_4_trtmnt_GT_15yrs_tb_lp  : { type: Number, required: false, 'default': 0 },
    leprosy_cases_rgtd_0_to_4yrs  : { type: Number, required: false, 'default': 0 },
    leprosy_cases_rgtd_5_to_15yrs  : { type: Number, required: false, 'default': 0 },
    leprosy_cases_rgtd_GT_15yrs_tb_lp  : { type: Number, required: false, 'default': 0 },
    buruli_ulcer_patients_notifd_0_to_4yrs  : { type: Number, required: false, 'default': 0 },
    buruli_ulcer_patients_notifd_5_to_15yrs  : { type: Number, required: false, 'default': 0 },
    buruli_ulcer_patients_notifd_GT_15yrs_tb_lp  : { type: Number, required: false, 'default': 0 }
});
module.exports = tbCasesItemModelSchema;