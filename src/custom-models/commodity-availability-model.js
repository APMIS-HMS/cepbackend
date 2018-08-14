const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commodityItemModelSchema = new Schema({
    stock_out_essential_drugs_4_7_consecutv_days  : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_vaccine_supplies_in_d_past_1mth   : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_family_planing_comodities_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_female_condoms_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_emerg_contraceptn_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_oxytocin_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_misoprostol_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_magsulfate_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_inj_antibiotics_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_ANCS_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_chlorhexidine_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_resuscitatn_equipmt_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_amoxicillin_DT : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_ORS_Zinc  : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_IFAs  : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_ACTs_4_7_consecutiv_days_in_d_last_1mth   : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_RDTs_4_7days_consecutvely  : { type: String, required: false, 'default': 'No Value' }, 
    did_u_expr_stock_out_of_SPs_for_7days_consecutvely_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    did_u_expr_stock_out_of_LLINs_for_7days_consecutvely_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    stock_out_of_antiretroviral_drugs_for_7days_consecutvely : { type: String, required: false, 'default': 'No Value' }, 
    stock_out_of_HIV_test_kits_for_7days_consecutvely_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    stock_out_of_antiTB_drugs_for_7days_consecutvely_in_d_past_1mth  : { type: String, required: false, 'default': 'No Value' }, 
    stock_out_of_CPT_for_7days_consecutvely_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' },
    stock_out_of_INH_for_7days_consecutvely_in_d_past_1mth : { type: String, required: false, 'default': 'No Value' }
});
module.exports = commodityItemModelSchema;