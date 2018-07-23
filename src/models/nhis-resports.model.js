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
const imciSchema = require('../custom-models/imci-model');
const familyPlanningSchema = require('../custom-models/family-planning-model');
const referralsSchema = require('../custom-models/referrals-item-model');
const ncdmSchema = require('../custom-models/non-communicable-disease-model');
const stiSchema = require('../custom-models/sti-model');
const labSchema = require('../custom-models/lab-model');
const inpatientSchema = require('../custom-models/inpatient-model');
const inpatientAdminSchema = require('../custom-models/inpatient-admissions-model');
const pharmaceuticalSchema = require('../custom-models/pharmaceutical-model');
const adverseDrugSchema = require('../custom-models/adverse-drug-reaction-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const nhisResports = new Schema({
    Facility_Attendance: facilityAttendanceSchema,
    Maternal_Health: maternalHealthSchema,
    Tetanus_Toxoid_Women_Child_Bearing_Age: tetanusToxoidSchema,
    Pregnancy_Outcome: pregnancyItemSchema,
    Immunization: immunizationSchema,
    Nutrition: nutritionSchema,
    Malaria_Prevention_LLIN: malariapreventionSchema,
    IMCI: imciSchema,
    Family_Planning: familyPlanningSchema,
    Referrals: referralsSchema,
    Non_Communicable_Disease: ncdmSchema,
    Sexually_Transmitted_Infections: stiSchema,
    Laboratory: labSchema,
    Inpatient: inpatientSchema,
    Inpatient_Admissions: inpatientAdminSchema,
    Pharmaceutical_Service: pharmaceuticalSchema,
    Adverse_Drug_Reaction: adverseDrugSchema,
    Mortality: {
      type: String,
      required: true
    },
    Neonatal_Deaths: {
      type: String,
      required: true
    },
    Under_5_Mortality: {
      type: String,
      required: true
    },
    HIV_Counselling_Testing: {
      A: {
        type: String,
        required: true
      },
      B: {
        type: String,
        required: true
      }
    },
    HIV_Care_and_Treatment: {
      type: String,
      required: true
    },
    SRH_HIV_Integration: {
      type: String,
      required: true
    },
    TB_HIV: {
      type: String,
      required: true
    },
    PM_TCT: {
      Mother: {
        type: String,
        required: true
      },
      Infant: {
        type: String,
        required: true
      },
    },
    TB_LP: {
      type: String,
      required: true
    },
    Malaria_Testing: {
      type: String,
      required: true
    },
    Malaria_in_Pregnancy: {
      type: String,
      required: true
    },
    Malaria_Cases: {
      type: String,
      required: true
    },
    Malaria_Treatment: {
      type: String,
      required: true
    },
    Obstetric_Fistula: {
      A: {
        type: String,
        required: true
      },
      B: {
        type: String,
        required: true
      }
    },
    Commodity_Availability: {
      type: String,
      required: true
    }
















  }, {
    timestamps: true
  });

  return mongooseClient.model('nhisResports', nhisResports);
};
