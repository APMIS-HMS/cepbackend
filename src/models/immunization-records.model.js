// immunization-records-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const vaccineSchema = require('../custom-models/vaccine-model');
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immunizationRecords = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        patientId: { type: Schema.Types.ObjectId, required: true },
        immunizations: [{
            immunizationScheduleId: { type: Schema.Types.ObjectId, required: true },
            administeredBy: { type: Schema.Types.ObjectId, required: false }, // Employee that administered the vaccine.
            immunizationName: { type: String, required: true },
            vaccine: vaccineSchema,
            sequence: { type: Number, required: true },
            appointmentId: { type: Schema.Types.ObjectId, required: true },
            appointmentDate: { type: Schema.Types.Date, required: true },
            administered: { type: Boolean, 'default': false, required: true }, // This shows the immunization status
            createdAt: { type: Date, 'default': Date.now },
            updatedAt: { type: Date, 'default': Date.now }
        }],
    }, {
        timestamps: true
    });

    return mongooseClient.model('immunizationRecords', immunizationRecords);
};