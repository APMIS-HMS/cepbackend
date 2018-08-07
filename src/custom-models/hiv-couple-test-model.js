const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const coupleItemModelSchema = new Schema({
    counseled_testd_rcvd_rslts : { type: Number, required: false, 'default': 0 },
    counseled_testd_n_rcvd_rslts_sero_discordt : { type: Number, required: false, 'default': 0 }
});
module.exports = coupleItemModelSchema;