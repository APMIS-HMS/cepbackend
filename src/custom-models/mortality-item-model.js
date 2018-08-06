const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const totalDeathsItemModelSchema = new Schema({
    total_deaths_0_28_days : { type: Number, required: false, 'default': 0 },
    total_deaths_29d_11_months   : { type: Number, required: false, 'default': 0 },
    total_deaths_12_59_months  : { type: Number, required: false, 'default': 0 },
    total_deaths_5_9_years  : { type: Number, required: false, 'default': 0 },
    total_deaths_10_19_years  : { type: Number, required: false, 'default': 0 },
    total_deaths_20_years_and_above  : { type: Number, required: false, 'default': 0 }
});
module.exports = totalDeathsItemModelSchema;
