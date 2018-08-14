const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const labourDeliverySchema = new Schema({
    Spontaneous_Vaginal_Delivery : { type: Number, required: false, 'default': 0 },
    Deliveries_Assisted : { type: Number, required: false, 'default': 0 },
    Deliveries_Caesarian_Section : { type: Number, required: false, 'default': 0 },
    Deliveries_Complications : { type: Number, required: false, 'default': 0 },
    Preterm_deliveries : { type: Number, required: false, 'default': 0 },
    Deliveries_HIV_positive_women : { type: Number, required: false, 'default': 0 },
    Live_birth_by_HIV_positive_women : { type: Number, required: false, 'default': 0 },
    Deliveries_HIV_positive_women_Booked : { type: Number, required: false, 'default': 0 },
    Deliveries_HIV_positive_women_Unbooked : { type: Number, required: false, 'default': 0 },
    Deliveries_monitored_with_partograph : { type: Number, required: false, 'default': 0 },
    Deliveries_by_skilled_birth_attendants : { type: Number, required: false, 'default': 0 },
});
module.exports = labourDeliverySchema;