const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const totalDeathsItemModelSchema = new Schema({
    cos_mat_dth_APH  : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_pre_eclampsia : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_PPH : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_Sepsis : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_obsted_labr : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_abtn : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_malaria : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_anaemia : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_HIV : { type: Number, required: false, 'default': 0 },
    cos_mat_dth_others : { type: Number, required: false, 'default': 0 }
});
module.exports = totalDeathsItemModelSchema;