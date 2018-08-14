const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STIModelSchema = new Schema({
    STI_treated_new_case : { type: Number, required: false, 'default': 0 },
    male_urethritis_new_cases : { type: Number, required: false, 'default': 0 }
});
module.exports = STIModelSchema;