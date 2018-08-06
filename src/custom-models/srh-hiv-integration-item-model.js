const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const srhHivItemModelSchema = new Schema({
    HCT_Cs_wit_SRH_HIV_inte_serv  : { type: Number, required: false, 'default': 0 },
    indl_refrd_4_FP_serv_frm_HCT  : { type: Number, required: false, 'default': 0 },
    HCT_Cs_scrnd_4_STIs   : { type: Number, required: false, 'default': 0 },
    HCT_Cs_trted_4_STIs  : { type: Number, required: false, 'default': 0 }
});
module.exports = srhHivItemModelSchema;