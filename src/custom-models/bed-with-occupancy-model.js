const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bedWithOccupancySchema = new Schema({
    wardRoom: { type: String},
    name: { type: String},
    patientId: { type: Schema.Types.ObjectId },
}, {
    timestamps: true
});
module.exports = bedWithOccupancySchema;