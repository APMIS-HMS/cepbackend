const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fistulaItemModelSchema = new Schema({
    women_rcvin_surgery_4_fistula_repair_VVF  : { type: Number, required: false, 'default': 0 },
    women_rcvin_surgery_4_fistula_repair_RVF  : { type: Number, required: false, 'default': 0 }, 
    women_rcvin_surgery_4_fistula_repair_RVF_n_VVF : { type: Number, required: false, 'default': 0 },
    women_rcvin_first_repair_VVF  : { type: Number, required: false, 'default': 0 },
    women_rcvin_first_repair_RVF : { type: Number, required: false, 'default': 0 },
    women_rcvin_first_repair_RVF_VVF  : { type: Number, required: false, 'default': 0 },
    women_rcvin_second_repair_VVF  : { type: Number, required: false, 'default': 0 },
    women_rcvin_second_repair_RVF : { type: Number, required: false, 'default': 0 },
    women_rcvin_second_repair_RVF_VVF : { type: Number, required: false, 'default': 0 },
    women_discharged_aftr_fistula_surgry_VVF  : { type: Number, required: false, 'default': 0 },
    women_discharged_aftr_fistula_surgry_RVF  : { type: Number, required: false, 'default': 0 }, 
    women_discharged_aftr_fistula_surgry_RVF_VVF : { type: Number, required: false, 'default': 0 },
    women_who_had_closed_n_dry_fistula_discharge_VVF : { type: Number, required: false, 'default': 0 },
    women_who_had_closed_n_dry_fistula_discharge_RVF  : { type: Number, required: false, 'default': 0 },
    women_who_had_closed_n_dry_fistula_discharge_RVF_VVF : { type: Number, required: false, 'default': 0 }
});
module.exports = fistulaItemModelSchema;