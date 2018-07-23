// nhis-resports-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const facilityAttendanceSchema = require('../custom-models/facility-attendance-model');
const maternalHealthSchema = require('../custom-models/maternal-health-model');
const tetanusToxoidSchema = require('../custom-models/tetanus-toxoid-model');
const pregnancyItemSchema = require('../custom-models/pregnancy-item-model');
const immunizationSchema = require('../custom-models/immunization-model');
const nutritionSchema = require('../custom-models/nutrition-model');
const malariapreventionSchema = require('../custom-models/malaria-prevention-item-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const nhisResports = new Schema({
    Facility_Attendance : facilityAttendanceSchema,
    Maternal_Health : maternalHealthSchema,
    Tetanus_Toxoid_Women_Child_Bearing_Age : tetanusToxoidSchema,
    Pregnancy_Outcome:pregnancyItemSchema,
    Immunization:immunizationSchema,
    Nutrition:nutritionSchema,
    Malaria_Prevention_LLIN: malariapreventionSchema,
    IMCI : { type: String, required: true },
    Family_Planning:{
      A:{ type: String, required: true },
      B:{ type: String, required: true }
    },
    Referrals:{ type: String, required: true },
    Non_Communicable_Disease:{ type: String, required: true },
    Sexually_Transmitted_Infections:{ type: String, required: true },
    Laboratory:{ type: String, required: true },
    Inpatient:{ type: String, required: true },
    Inpatient_Admissions:{ type: String, required: true },
    Pharmaceutical_Service:{ type: String, required: true },
    Adverse_Drug_Reaction:{
      A:{ type: String, required: true },
      B:{ type: String, required: true }
    },
    Mortality:{ type: String, required: true },
    Neonatal_Deaths:{ type: String, required: true },
    Under_5_Mortality:{ type: String, required: true },
    HIV_Counselling_Testing:{
      A:{ type: String, required: true },
      B:{ type: String, required: true }
    },
    HIV_Care_and_Treatment :{ type: String, required: true },
    SRH_HIV_Integration : { type: String, required: true },
    TB_HIV : { type: String, required: true },
    PM_TCT:{
      Mother : { type: String, required: true },
      Infant : { type: String, required: true },
    },
    TB_LP : { type: String, required: true },
    Malaria_Testing : { type: String, required: true },
    Malaria_in_Pregnancy : { type: String, required: true },
    Malaria_Cases : { type: String, required: true },
    Malaria_Treatment  : { type: String, required: true },
    Obstetric_Fistula : {
      A:{ type: String, required: true },
      B:{ type: String, required: true }
    },
    Commodity_Availability: { type: String, required: true }
















  }, {
    timestamps: true
  });

  return mongooseClient.model('nhisResports', nhisResports);
};
