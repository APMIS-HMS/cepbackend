const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const labModelSchema = new Schema({
    ANC_Anaemia_test_done : { type: Number, required: false, 'default': 0 },
    ANC_Anaemia_test_positive : { type: Number, required: false, 'default': 0 },
    ANC_Proteinuria_test_done   : { type: Number, required: false, 'default': 0 },
    ANC_Proteinuria_test_positive  : { type: Number, required: false, 'default': 0 },
    HIV_rapid_antibody_test_done : { type: Number, required: false, 'default': 0 },
    sputum_AFB_new_diagnostic_test_done_incl_relapse : { type: Number, required: false, 'default': 0 },
    sputum_AFB_new_diagnostic_test_done_incl_relapse_test_positve : { type: Number, required: false, 'default': 0 }
});
module.exports = labModelSchema;