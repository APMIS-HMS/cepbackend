const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const totalDeathsItemModelSchema = new Schema({
    deaths_women_rel_to_pregnancy  : { type: Number, required: false, 'default': 0 },
    maternal_deaths_audited : { type: Number, required: false, 'default': 0 }
});
module.exports = totalDeathsItemModelSchema;
