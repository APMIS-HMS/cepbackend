// laboratoryReports-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const {
        Schema
    } = mongooseClient;
    const laboratoryReports = new Schema({
        facilityId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        laboratoryId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        workBench: {
            type: Schema.Types.Mixed,
            required: true
        },
        // request: { type: Schema.Types.Mixed, required: true },
        patientId: {
            type: Schema.Types.ObjectId,
            required: true
        }, //done
        // investigation: { type: Schema.Types.Mixed, required: true }, by starday
        publishedById: {
            type: Schema.Types.ObjectId,
            required: false
        }, //done
        result: {
            type: Schema.Types.Mixed,
            required: true
        },
        // sampleNumber: { type: String, required: true }, by starday
        clinicalDocumentation: {
            type: String,
            required: false
        },
        diagnosis: {
            type: String,
            required: false
        },
        outcome: {
            type: Schema.Types.Mixed,
            required: true
        },
        conclusion: {
            type: String,
            required: false
        },
        recommendation: {
            type: String,
            required: false
        },
        isUploaded: {
            type: Boolean,
            default: false
        },

        //by starday
        specimenReceived: {
            type: Boolean,
            default: false
        },
        specimenNumber: {
            type: String,
            required: false
        },
        sampleTaken: {
            type: Boolean,
            default: false
        },
        sampleTakenBy: {
            type: Schema.Types.ObjectId,
            required: false
        },
        requestClinicalInformation: {
            type: String,
            required: false
        },
        requestDiagnosis: {
            type: String,
            required: false
        },
        investigationId: {
            type: Schema.Types.ObjectId,
            required: false
        },
        requestId: {
            type: Schema.Types.ObjectId,
            required: false
        }
    }, {
        timestamps: true
    });

    return mongooseClient.model('laboratoryReports', laboratoryReports);
};
