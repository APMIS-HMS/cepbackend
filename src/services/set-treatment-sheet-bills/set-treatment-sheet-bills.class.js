/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {

  }

  async create(data, params) {
    const labrequestService = this.app.service('laboratory-requests');
    const treatmentSheetsService = this.app.service('treatment-sheets');
    const billCreatorsService = this.app.service('bill-creators');
    const patientsService = this.app.service('patients');

    
    const patient = await patientsService.find({
      query: {
        facilityId: data.facilityId,
        personId: data.personId,
        $select: ['_id', 'clientsNo', 'paymentPlan']
      }
    });
    
    let bills = [];
    let procedureBills = [];
    let medicationBills = [];
    let investigationItems = [];
    let billCreator ={};
    
    let billCreatorPrecedure = {};
    let billCreatorMed = {};
    
    if (data.treatmentSheet.investigations !== undefined) {
      
      data.treatmentSheet.investigations.map(investigation => {
        if (investigation.isBilled === true) {
          const bill = {
            unitPrice: 0,
            facilityId: data.facilityId,
            unitPriceChanges: [],
            facilityServiceId: investigation.facilityServiceId,
            serviceId: investigation.serviceId,
            patientId: patient.data[0]._id,
            quantity: 1,
            active: true,
            totalPrice: 0,
            covered: {
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
            },
          };

          const item = {
            isUrgent: false,
            isExternal: false,
            investigation: {
              isPanel: false,
              LaboratoryWorkbenches: investigation.LaboratoryWorkbenches,
              facilityServiceId: investigation.facilityServiceId,
              serviceId: investigation.serviceId,
              reportType: investigation.reportType,
              specimen: investigation.specimen,
              unit: investigation.unit,
              name: investigation.name,
              facilityId: data.facilityId
            }
          }
          investigationItems.push(item);

          if (investigation.investigation !== undefined) {
            bill.unitPrice = (investigation.investigation.changedPrice === undefined) ? investigation.investigation.location.workbenches[0].price : investigation.investigation.changedPrice;
            bill.totalPrice = bill.unitPrice;
            if (investigation.investigation.changedPrice !== undefined) {
              bill.unitPriceChanges.push({
                currentPrice: investigation.investigation.changedPrice,
                oldPrice: investigation.investigation.location.workbenches[0].price,
                userId: params.user._id
              });
            }
          }

          bills.push(bill);
        }
      });
      if(bills.length>0){
    
        billCreator = await billCreatorsService.create(bills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
    
        const laboratoryRequests = {
          facilityId: data.facilityId,
          patientId: patient.data[0]._id,
          createdBy: params.user._id,
          clinicalInformation: "N/A",
          diagnosis: "N/A",
          investigations: investigationItems,
          billingId: billCreator
        };
    
        labrequestService.create(laboratoryRequests).then(payload=>{
          _requests = payload;
        });
        
      }
    }
    
    if (data.treatmentSheet.procedures !== undefined) {
      data.treatmentSheet.procedures.map(procedure => {
        const bill = {
          unitPrice: (procedure.changedPrice === undefined || procedure.changedPrice === null) ? procedure.price.price : procedure.changedPrice,
          facilityId: data.facilityId,
          unitPriceChanges: [],
          facilityServiceId: procedure.price.facilityServiceId,
          serviceId: procedure.price.serviceId,
          patientId: patient.data[0]._id,
          quantity: 1,
          active: true,
          totalPrice: (procedure.changedPrice === undefined || procedure.changedPrice === null) ? procedure.price.price : procedure.changedPrice,
          covered: {
            coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
          },
        };

        procedureBills.push(bill);
      });
      billCreatorPrecedure = await billCreatorsService.create(procedureBills, {
        query: {
          facilityId: data.facilityId,
          patientId: patient.data[0]._id
        }
      });
    
    }
    
    if (data.treatmentSheet.medications !== undefined) {
      data.treatmentSheet.medications.map(medication => {
        const bill = {
          unitPrice: (medication.changedPrice === undefined || medication.changedPrice === null) ? medication.cost : medication.changedPrice,
          facilityId: data.facilityId,
          unitPriceChanges: [],
          facilityServiceId: medication.facilityServiceId,
          serviceId: medication.serviceId,
          patientId: patient.data[0]._id,
          quantity: medication.quantity,
          active: true,
          totalPrice: medication.quantity * ((medication.changedPrice === undefined || medication.changedPrice === null) ? medication.cost : medication.changedPrice),
          covered: {
            coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
          },
        };
        if (medication.changedPrice !== undefined) {
          bill.unitPriceChanges.push({
            currentPrice: medication.changedPrice,
            oldPrice: medication.cost,
            userId: params.user._id
          });
        }
        medicationBills.push(bill);
      });
      billCreatorMed = await billCreatorsService.create(medicationBills, {
        query: {
          facilityId: data.facilityId,
          patientId: patient.data[0]._id
        }
      });
    }
    
    const treatmentSheet = await treatmentSheetsService.create(data);
    
    const result = {
      investigations: billCreator,
      procedures: billCreatorPrecedure,
      medications: billCreatorMed,
      treatmentSheet: treatmentSheet
    }
    
    return jsend.success(result);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
