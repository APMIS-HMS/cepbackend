const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nutritionItemModelSchema = new Schema({
    children_under_5years_who_received_LLIN_this_month : { type: Number, required: false, 'default': 0 }
});
module.exports = nutritionItemModelSchema;
