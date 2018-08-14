const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const srhHivItemModelSchema = new Schema({
    indvd_clinicaly_scrnd_4_TB   : { type: Number, required: false, 'default': 0 },
    indvd_clinicaly_scrnd_4_TB_score_1plus_TB_suspts : { type: Number, required: false, 'default': 0 },
    rgtd_TB_patients_scrnd_4_HIV : { type: Number, required: false, 'default': 0 },
    indvd_strtd_TB_treatmt_HIV_negativ   : { type: Number, required: false, 'default': 0 },
    indvds_strtd_TB_treatmt_HIV_unknown : { type: Number, required: false, 'default': 0 },
    HIV_postiv_Cs_attndin_HIV_care_n_trtmnt_serv_n_rcvin_TB_trtmnt : { type: Number, required: false, 'default': 0 },
    TB_patients_wit_HIV_rcvin_ART : { type: Number, required: false, 'default': 0 },
    coinfected_persons_on_CPT : { type: Number, required: false, 'default': 0 }

});
module.exports = srhHivItemModelSchema;