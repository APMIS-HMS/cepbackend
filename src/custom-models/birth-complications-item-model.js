const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stillBirthItemModelSchema = new Schema({
    birth_asphyxia : { type: Number, required: false, 'default': 0 },
    neonatal_sepsis : { type: Number, required: false, 'default': 0 },
    neonatal_tetanus_NHMIS : { type: Number, required: false, 'default': 0 },
    neonatal_jaundice: { type: Number, required: false, 'default': 0 },
    low_birth_weight_babies_placed_in_KMC : { type: Number, required: false, 'default': 0 },
    newborns_with_low_birth_weight_discharged_after_KMC : { type: Number, required: false, 'default': 0 },
});
module.exports = stillBirthItemModelSchema;