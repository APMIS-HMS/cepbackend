const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hivCareItemModelSchema = new Schema({
    hiv_postiv_rcving_CP_LT_15yrs : { type: Number, required: false, 'default': 0 },
    hiv_postiv_rcving_CP_GT_15yrs : { type: Number, required: false, 'default': 0 },
    ART_patients_rcving_ARV_refill_LT_15yrs  : { type: Number, required: false, 'default': 0 },
    ART_patients_rcving_ARV_refill_GT_15yrs : { type: Number, required: false, 'default': 0 }
});
module.exports = hivCareItemModelSchema;