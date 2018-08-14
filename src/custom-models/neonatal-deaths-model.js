const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cosNeonatalItemModelSchema = new Schema({
    cos_neonatal_dth_asphyxia  : { type: Number, required: false, 'default': 0 },
    cos_neonata_dth_neonatal_sepsis : { type: Number, required: false, 'default': 0 },
    cos_neonatal_dth_prematurity : { type: Number, required: false, 'default': 0 },
    cos_neonatal_dth_tetanus : { type: Number, required: false, 'default': 0 },
    cos_neonatal_dth_diarrhoea : { type: Number, required: false, 'default': 0 },
    cos_neonatal_dth_congenital_malformation : { type: Number, required: false, 'default': 0 },
    cos_neonatal_dth_others_neonate : { type: Number, required: false, 'default': 0 }
});
module.exports = cosNeonatalItemModelSchema;
