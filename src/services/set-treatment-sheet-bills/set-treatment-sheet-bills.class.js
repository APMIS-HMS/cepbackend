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
    let labRequests = {};

    let billCreatorPrecedure = {};
    let billCreatorMed = {};

    const treatmentSheet = await treatmentSheetsService.create(data);
    console.log(1, treatmentSheet);

    if (data.treatmentSheet.investigations !== undefined) {
      console.log('a');
      data.treatmentSheet.investigations.map(investigation => {
        console.log('b');
        let bill = {};
        console.log('c');
        if (investigation.isBilled === true) {
          console.log('d');
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
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
            },
          };
          console.log('e');
          if (investigation.investigation !== undefined) {
            console.log('f');
            bill.unitPrice = (investigation.investigation.changedPrice !== null && investigation.investigation.changedPrice !== undefined) ? investigation.investigation.changedPrice : investigation.investigation.location.workbenches[0].price;
            console.log('g');
            bill.totalPrice = bill.unitPrice;
            console.log('h');
            if (investigation.investigation.changedPrice !== undefined) {
              console.log('i');
              bill.unitPriceChanges.push({
                currentPrice: investigation.investigation.changedPrice,
                oldPrice: investigation.investigation.location.workbenches[0].price,
                userId: data.createdBy
              });
              console.log('h');
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
        console.log('j');
        investigationItems.push(item);
      });
      console.log('bills.length ' + bills.length);
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
        billingId: billCreator
      };
      await labrequestService.create(laboratoryRequests);
    }
    console.log(2);
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
    console.log(3);
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
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
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

        billCreatorMed.billItems.map(x => {
          data.treatmentSheet.medications.map(y => {
            if (x.serviceId !== undefined && x.facilityServiceId !== undefined && x.serviceId.toString() === y.serviceId.toString() && x.facilityServiceId.toString() === y.facilityServiceId.toString()) {
              y.billItemId = x._id;
              y.billId = billCreatorMed._id;
            }
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
          prescriptionItems:  data.treatmentSheet.medications
        };
        await prescriptionService.create(prescribe);
      }
    }
    console.log(4);
    const result = {
      investigations: billCreator,
      procedures: billCreatorPrecedure,
      medications: billCreatorMed,
      treatmentSheet: treatmentSheet
    }
    console.log(5);

    return jsend.success(result);
  }

  update(id, data, params) {
    return Promise.resolve(data);
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
    console.log(1, treatmentSheet);

    if (data.treatmentSheet.investigations !== undefined) {
      console.log('a');
      data.treatmentSheet.investigations.map(investigation => {
        if (investigation.isExisting === undefined) {
          console.log('b');
          let bill = {};
          console.log('c');
          if (investigation.isBilled === true) {
            console.log('d');
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
                coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
              },
            };
            console.log('e');
            if (investigation.investigation !== undefined) {
              console.log('f');
              bill.unitPrice = (investigation.investigation.changedPrice !== null && investigation.investigation.changedPrice !== undefined) ? investigation.investigation.changedPrice : investigation.investigation.location.workbenches[0].price;
              console.log('g');
              bill.totalPrice = bill.unitPrice;
              console.log('h');
              if (investigation.investigation.changedPrice !== undefined) {
                console.log('i');
                bill.unitPriceChanges.push({
                  currentPrice: investigation.investigation.changedPrice,
                  oldPrice: investigation.investigation.location.workbenches[0].price,
                  userId: data.createdBy
                });
                console.log('h');
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
          console.log('j');
          investigationItems.push(item);
        }
      });
      console.log('bills.length ' + bills.length);
      if (bills.length > 0) {
        billCreator = await billCreatorsService.create(bills, {
          query: {
            facilityId: data.facilityId,
            patientId: patient.data[0]._id
          }
        });
        const laboratoryRequests = {
          facilityId: data.facilityId,
          patientId: patient.data[0]._id,
          createdBy: data.createdBy,
          clinicalInformation: "N/A",
          diagnosis: "N/A",
          investigations: investigationItems,
          billingId: billCreator
        };
        await labrequestService.create(laboratoryRequests);
      }
    }
    console.log(2);
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
              coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
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
    console.log(3);
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
                coverType: patient.data[0].paymentPlan.find(x => x.isDefault !== true).planType
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
        billCreatorMed.billItems.map(x => {
          data.treatmentSheet.medications.map(y => {
            if (x.serviceId !== undefined && x.facilityServiceId !== undefined && x.serviceId.toString() === y.serviceId.toString() && x.facilityServiceId.toString() === y.facilityServiceId.toString()) {
              y.billItemId = x._id;
              y.billId = billCreatorMed._id;
            }
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
          prescriptionItems:  data.treatmentSheet.medications
        };
        await prescriptionService.create(prescribe);
      }
    }
    console.log(4);
    const result = {
      investigations: billCreator,
      procedures: billCreatorPrecedure,
      medications: billCreatorMed,
      treatmentSheet: treatmentSheet
    }
    console.log(5);

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
