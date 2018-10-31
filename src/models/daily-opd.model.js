// daily-opd-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const dailyOpd = new Schema({
    patientId: { type: Schema.Types.ObjectId, required: true },
    attendanceTypeId: { type: Schema.Types.ObjectId, required: true },//thesame with appointment TypeId
    presentComplaint: { type: String, required: true },
    diagnosis: { type: String, required: true },
    investigationId: { type: Schema.Types.ObjectId, required: true },
    locationId: { type: Schema.Types.ObjectId, required: true },
    dispensedProductId: { type: Schema.Types.ObjectId, required: true },
    visits: { type: Schema.Types.Mixed, required: true },// NT T A RO D
    malaria: { 
      clinical_diagnosis_only:{
                                lt5yrs:{ type: Boolean, required: false },
                                ge5yrs:{ type: Boolean, required: false },
                                pw:{ type: Boolean, required: false },
      },
      laboratory_diagnosis:{
        rdt:{
          lt5yrs:{ type: Boolean, required: false },
          ge5yrs:{ type: Boolean, required: false }
        },
        microscopy:{
          lt5yrs:{ type: Boolean, required: false },
          ge5yrs:{ type: Boolean, required: false }
        },
        confirmed_uncomplicated_malaria:{
          lt5yrs:{ type: Boolean, required: false },
          ge5yrs:{ type: Boolean, required: false }
        },
        severe_malaria:{
          lt5yrs:{ type: Boolean, required: false },
          ge5yrs:{ type: Boolean, required: false }
        },
        is_other_antimalarial_given: { type: Boolean, required: false }
        
}
}
    }, {
    timestamps: true
  });

  return mongooseClient.model('dailyOpd', dailyOpd);
};
