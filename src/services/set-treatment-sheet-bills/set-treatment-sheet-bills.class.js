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
    const prescriptionPriorityService = this.app.service('prescription-priorities');
    const prescriptionService = this.app.service('prescriptions');
    const patient = await patientsService.find({
      query: {
        facilityId: data.facilityId,
        personId: data.personId,
        $select: ['_id', 'clientsNo', 'paymentPlan']
      }
    });
    const prescriptionPriority = await prescriptionPriorityService.find({
      query: {
        name: 'Normal',
        $select: ['_id', 'name']
      }
    });
    let bills = [];
    let procedureBills = [];
    let medicationBills = [];
    let investigationItems = [];
    let billCreator = {};
    let createdTreatment = {};

    let billCreatorPrecedure = {};
    let billCreatorMed = {};

    const orderSet = await treatmentSheetsService.find({
      query: {
        personId: params.query.personId,
        facilityId: params.query.facilityId,
        completed: false
      }
    });
    orderSet.data = (orderSet.data.length === 0) ? [{
      treatmentSheet: {}
    }] : orderSet.data;
    orderSet.data[0].treatmentSheet.medications = (orderSet.data[0].treatmentSheet.medications === undefined) ? [] : orderSet.data[0].treatmentSheet.medications;
    data.treatmentSheet.medications = (data.treatmentSheet.medications === undefined) ? [] : data.treatmentSheet.medications;
    orderSet.data[0].treatmentSheet.medications.push(...data.treatmentSheet.medications);
    orderSet.data[0].treatmentSheet.investigations = (orderSet.data[0].treatmentSheet.investigations === undefined) ? [] : orderSet.data[0].treatmentSheet.investigations;
    data.treatmentSheet.investigations = (data.treatmentSheet.investigations === undefined) ? [] : data.treatmentSheet.investigations;
    orderSet.data[0].treatmentSheet.investigations.push(...data.treatmentSheet.investigations); //.filter(x => x.isBilled === false));
    orderSet.data[0].treatmentSheet.procedures = (orderSet.data[0].treatmentSheet.procedures === undefined) ? [] : orderSet.data[0].treatmentSheet.procedures;
    data.treatmentSheet.procedures = (data.treatmentSheet.procedures === undefined) ? [] : data.treatmentSheet.procedures;
    orderSet.data[0].treatmentSheet.procedures.push(...data.treatmentSheet.procedures);
    orderSet.data[0].treatmentSheet.nursingCares = (orderSet.data[0].treatmentSheet.nursingCares === undefined) ? [] : orderSet.data[0].treatmentSheet.nursingCares;
    data.treatmentSheet.nursingCares = (data.treatmentSheet.nursingCares === undefined) ? [] : data.treatmentSheet.nursingCares;
    orderSet.data[0].treatmentSheet.nursingCares.push(...data.treatmentSheet.nursingCares);
    orderSet.data[0].treatmentSheet.physicianOrders = (orderSet.data[0].treatmentSheet.physicianOrders === undefined) ? [] : orderSet.data[0].treatmentSheet.physicianOrders;
    data.treatmentSheet.physicianOrders = (data.treatmentSheet.physicianOrders === undefined) ? [] : data.treatmentSheet.physicianOrders;
    orderSet.data[0].treatmentSheet.physicianOrders.push(...data.treatmentSheet.physicianOrders);
    if (orderSet.data[0]._id !== undefined) {
      createdTreatment = await treatmentSheetsService.patch(orderSet.data[0]._id, {
        treatmentSheet: orderSet.data[0].treatmentSheet
      }, {});
    } else {
      createdTreatment = await treatmentSheetsService.create(data);
    }

    if (data.treatmentSheet.investigations !== undefined) {
      data.treatmentSheet.investigations.map(investigation => {
        let bill = {};
        if (investigation.isBilled === true) {
          bill = {
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
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
            },
          };
          if (investigation.investigation !== undefined) {
            bill.unitPrice = (investigation.investigation.changedPrice !== null && investigation.investigation.changedPrice !== undefined) ? investigation.investigation.changedPrice : investigation.investigation.location.workbenches[0].price;
            bill.totalPrice = bill.unitPrice;
            if (investigation.investigation.changedPrice !== undefined) {
              bill.unitPriceChanges.push({
                currentPrice: investigation.investigation.changedPrice,
                oldPrice: investigation.investigation.location.workbenches[0].price,
                userId: data.createdBy
              });
            }
          }

          bills.push(bill);
        }
        const item = {
          isUrgent: false,
          isExternal: (investigation.isBilled === true) ? false : true,
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
      });
      if (bills.length > 0) {
        billCreator = await billCreatorsService.create(bills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
      }
      const laboratoryRequests = {
        facilityId: data.facilityId,
        patientId: patient.data[0]._id,
        createdBy: data.createdBy,
        clinicalInformation: "N/A",
        diagnosis: "N/A",
        investigations: investigationItems,
        billingId: billCreator[0]
      };
      await labrequestService.create(laboratoryRequests);
    }
    if (data.treatmentSheet.procedures !== undefined) {
      data.treatmentSheet.procedures.map(procedure => {
        const bill = {
          unitPrice: (procedure.changedPrice !== undefined && procedure.changedPrice !== null) ? procedure.changedPrice : procedure.price.price,
          facilityId: data.facilityId,
          unitPriceChanges: [],
          facilityServiceId: procedure.price.facilityServiceId,
          serviceId: procedure.price.serviceId,
          patientId: patient.data[0]._id,
          quantity: 1,
          active: true,
          totalPrice: (procedure.changedPrice !== undefined && procedure.changedPrice !== null) ? procedure.changedPrice : procedure.price.price,
          covered: {
            coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
          },
        };

        procedureBills.push(bill);
      });
      if (procedureBills.length > 0) {
        billCreatorPrecedure = await billCreatorsService.create(procedureBills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
      }
    }
    if (data.treatmentSheet.medications !== undefined) {
      data.treatmentSheet.medications.map(medication => {
        if (medication.isBilled) {
          const bill = {
            unitPrice: (medication.changedPrice !== undefined && medication.changedPrice !== null) ? medication.changedPrice : medication.cost,
            facilityId: data.facilityId,
            unitPriceChanges: [],
            facilityServiceId: medication.facilityServiceId,
            serviceId: medication.serviceId,
            patientId: patient.data[0]._id,
            quantity: medication.quantity,
            active: true,
            totalPrice: medication.quantity * ((medication.changedPrice !== undefined && medication.changedPrice !== null) ? medication.changedPrice : medication.cost),
            covered: {
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
            },
          };
          if (medication.changedPrice !== undefined && medication.changedPrice !== null) {
            bill.unitPriceChanges.push({
              currentPrice: medication.changedPrice,
              oldPrice: medication.cost,
              userId: params.user._id
            });
          }
          medicationBills.push(bill);
        }
      });
      if (medicationBills.length > 0) {
        billCreatorMed = await billCreatorsService.create(medicationBills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
        billCreatorMed.map(b => {
          b.billItems.map(x => {
            data.treatmentSheet.medications.map(y => {
              if (x.serviceId !== undefined && x.facilityServiceId !== undefined && y.isBilled && x.serviceId.toString() === y.serviceId.toString() && x.facilityServiceId.toString() === y.facilityServiceId.toString()) {
                y.billItemId = x._id;
                y.billId = billCreatorMed._id;
              }
            });
          });
        });
        const prescribe = {
          facilityId: data.facilityId,
          employeeId: data.createdBy,
          priority: prescriptionPriority.data[0],
          patientId: patient.data[0]._id,
          isCosted: false,
          isDispensed: false,
          isAuthorised: true,
          prescriptionItems: data.treatmentSheet.medications
        };
        prescriptionService.create(prescribe).then(pre => {
          
        }, err => {
        });
        
      }
    }
    const result = {
      investigations: billCreator,
      procedures: billCreatorPrecedure,
      medications: billCreatorMed,
      treatmentSheet: createdTreatment
    }
    return jsend.success(result);
  }

  async update(id, data, params) {
    const treatmentSheetsService = this.app.service('treatment-sheets');
    const documentationService = this.app.service('documentations');
    if (data.treatmentSheet.doc !== undefined) {
      const doc = data.treatmentSheet.doc;
      delete data.treatmentSheet.doc;
      await documentationService.patch(doc._id, {
        documentations: doc.documentations
      }, {});
    }
    const treatmentSheet = await treatmentSheetsService.patch(id, {
      treatmentSheet: data.treatmentSheet
    });
    return treatmentSheet;
  }

  async patch(id, data, params) {
    const labrequestService = this.app.service('laboratory-requests');
    const treatmentSheetsService = this.app.service('treatment-sheets');
    const billCreatorsService = this.app.service('bill-creators');
    const patientsService = this.app.service('patients');
    const prescriptionPriorityService = this.app.service('prescription-priorities');
    const prescriptionService = this.app.service('prescriptions');

    const patient = await patientsService.find({
      query: {
        facilityId: data.facilityId,
        personId: data.personId,
        $select: ['_id', 'clientsNo', 'paymentPlan']
      }
    });

    const prescriptionPriority = await prescriptionPriorityService.find({
      query: {
        name: 'Normal',
        $select: ['_id', 'name']
      }
    });

    let bills = [];
    let procedureBills = [];
    let medicationBills = [];
    let investigationItems = [];
    let billCreator = {};
    let labRequests = {};

    let billCreatorPrecedure = {};
    let billCreatorMed = {};

    const treatmentSheet = await treatmentSheetsService.patch(id, {
      treatmentSheet: data.treatmentSheet
    });

    if (data.treatmentSheet.investigations !== undefined) {
      data.treatmentSheet.investigations.map(investigation => {
        if (investigation.isExisting === undefined) {
          let bill = {};
          if (investigation.isBilled === true) {
            bill = {
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
                coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
              },
            };
            if (investigation.investigation !== undefined) {
              bill.unitPrice = (investigation.investigation.changedPrice !== null && investigation.investigation.changedPrice !== undefined) ? investigation.investigation.changedPrice : investigation.investigation.location.workbenches[0].price;
              bill.totalPrice = bill.unitPrice;
              if (investigation.investigation.changedPrice !== undefined) {
                bill.unitPriceChanges.push({
                  currentPrice: investigation.investigation.changedPrice,
                  oldPrice: investigation.investigation.location.workbenches[0].price,
                  userId: data.createdBy
                });
              }
            }

            bills.push(bill);
          }
          const item = {
            isUrgent: false,
            isExternal: (investigation.isBilled === true) ? false : true,
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
        }
      });
      if (bills.length > 0) {
        billCreator = await billCreatorsService.create(bills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
      }
      const laboratoryRequests = {
        facilityId: data.facilityId,
        patientId: patient.data[0]._id,
        createdBy: data.createdBy,
        clinicalInformation: "N/A",
        diagnosis: "N/A",
        investigations: investigationItems,
        billingId: billCreator[0]
      };
      if (billCreator.length === 0) {
        delete laboratoryRequests.billingId;
      }
      await labrequestService.create(laboratoryRequests);
    }
    if (data.treatmentSheet.procedures !== undefined) {
      data.treatmentSheet.procedures.map(procedure => {
        if (procedure.isExisting === undefined) {
          const bill = {
            unitPrice: (procedure.changedPrice !== undefined && procedure.changedPrice !== null) ? procedure.changedPrice : procedure.price.price,
            facilityId: data.facilityId,
            unitPriceChanges: [],
            facilityServiceId: procedure.price.facilityServiceId,
            serviceId: procedure.price.serviceId,
            patientId: patient.data[0]._id,
            quantity: 1,
            active: true,
            totalPrice: (procedure.changedPrice !== undefined && procedure.changedPrice !== null) ? procedure.changedPrice : procedure.price.price,
            covered: {
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
            },
          };
          procedureBills.push(bill);
        }
      });
      if (procedureBills.length > 0) {
        billCreatorPrecedure = await billCreatorsService.create(procedureBills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
      }
    }
    if (data.treatmentSheet.medications !== undefined) {
      data.treatmentSheet.medications.map(medication => {
        if (medication.isExisting === undefined) {
          if (medication.isBilled) {
            const bill = {
              unitPrice: (medication.changedPrice !== undefined && medication.changedPrice !== null) ? medication.changedPrice : medication.cost,
              facilityId: data.facilityId,
              unitPriceChanges: [],
              facilityServiceId: medication.facilityServiceId,
              serviceId: medication.serviceId,
              patientId: patient.data[0]._id,
              quantity: medication.quantity,
              active: true,
              totalPrice: medication.quantity * ((medication.changedPrice !== undefined && medication.changedPrice !== null) ? medication.changedPrice : medication.cost),
              covered: {
                coverType: patient.data[0].paymentPlan.find(x => x.isDefault === true).planType
              },
            };
            if (medication.changedPrice !== undefined && medication.changedPrice !== null) {
              bill.unitPriceChanges.push({
                currentPrice: medication.changedPrice,
                oldPrice: medication.cost,
                userId: params.user._id
              });
            }
            medicationBills.push(bill);
          }
        }
      });
      if (medicationBills.length > 0) {
        billCreatorMed = await billCreatorsService.create(medicationBills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
        billCreatorMed.map(b => {
          b.billItems.map(x => {
            data.treatmentSheet.medications.map(y => {
              if (x.serviceId !== undefined && x.facilityServiceId !== undefined && x.serviceId.toString() === y.serviceId.toString() && x.facilityServiceId.toString() === y.facilityServiceId.toString()) {
                y.billItemId = x._id;
                y.billId = billCreatorMed._id;
              }
            });
          });
        });
        const prescribe = {
          facilityId: data.facilityId,
          employeeId: data.createdBy,
          priority: prescriptionPriority.data[0],
          patientId: patient.data[0]._id,
          isCosted: false,
          isDispensed: false,
          isAuthorised: true,
          prescriptionItems: data.treatmentSheet.medications
        };
        const yu = await prescriptionService.create(prescribe);
      }
    }
    const result = {
      investigations: billCreator,
      procedures: billCreatorPrecedure,
      medications: billCreatorMed,
      treatmentSheet: treatmentSheet
    }
    return jsend.success(result);
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
