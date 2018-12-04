// patientDiagnosis-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const patientDiagnosis = new Schema({
        documentationId: { type: Schema.Types.ObjectId, required: true },
        patientId:{type:Schema.Types.ObjectId, required:true},
        facilityId:{type:Schema.Types.ObjectId, required:true},
        ICD10Code:{type:String, required:true},
        diagnosis:{type:String, required:true},
        diagnosisType:{type:String, required:true}
    }, {
        timestamps: true
    });

    return mongooseClient.model('patientDiagnosis', patientDiagnosis);
};
