const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const individual = require('./individual-item-hiv-test-model');
const individualItemModelSchema = new Schema({
    counseled_n_rcvd_results : individual,
    hiv_positive : individual
});
module.exports = individualItemModelSchema;
