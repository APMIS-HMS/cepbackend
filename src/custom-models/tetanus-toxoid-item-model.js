const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tetanusItemModelSchema = new Schema({
    Dose_1 : { type: Number, required: false, 'default': 0 },
    Dose_2 : { type: Number, required: false, 'default': 0 },
    Dose_3 : { type: Number, required: false, 'default': 0 },
    Dose_4 : { type: Number, required: false, 'default': 0 },
    Dose_5 : { type: Number, required: false, 'default': 0 }
});
module.exports = tetanusItemModelSchema;