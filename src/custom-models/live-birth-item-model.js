const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tetanusItemModelSchema = new Schema({
    less_than_2_5kg : { type: Number, required: false, 'default': 0 },
    greater_than_2_5kg : { type: Number, required: false, 'default': 0 }
});
module.exports = tetanusItemModelSchema;
