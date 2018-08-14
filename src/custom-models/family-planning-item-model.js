const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imciItemModelSchema = new Schema({
    clients_counselled   : { type: Number, required: false, 'default': 0 },
    new_family_planning_acceptors    : { type: Number, required: false, 'default': 0 },
    family_planning_clients_accessing_HCT_services : { type: Number, required: false, 'default': 0 },
    individual_referred_for_FP_services_from_HCT   : { type: Number, required: false, 'default': 0 },
    individual_referred_for_FP_services_from_ART_ART_Refill : { type: Number, required: false, 'default': 0 }
});
module.exports = imciItemModelSchema;