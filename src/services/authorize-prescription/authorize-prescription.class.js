'use strict';
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

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const prescriptionService = this.app.service('prescriptions');
    const patientService = this.app.service('patients');
    const billCreatorService = this.app.service('bill-creators');
    const accessToken = params.accessToken;
    const facilityId = data.facilityId;
    const prescription = data;

    if (accessToken !== undefined) {
      const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
      if (userRole.length > 0) {
        /* Create Billing for any item that has been billed */
        const billingItems = prescription.prescriptionItems.filter(x => x.isBilled);

        if (billingItems.length > 0) {
          const patientDetails =
            await patientService.get(prescription.patientId);
          const patientDefaultPaymentPlan =
            patientDetails.paymentPlan.find(x => x.isDefault === true);
          const bill = [];
          let covered = {};
          if (patientDefaultPaymentPlan.planType === 'wallet') {
            covered = {
              coverType: patientDefaultPaymentPlan.planType
            };
          } else if (patientDefaultPaymentPlan.planType === 'insurance') {
            covered = {
              coverType: patientDefaultPaymentPlan.planType,
              hmoId: patientDefaultPaymentPlan.planDetails.hmoId
            };
          } else if (patientDefaultPaymentPlan.planType === 'company') {
            covered = {
              coverType: patientDefaultPaymentPlan.planType,
              companyId: patientDefaultPaymentPlan.planDetails.companyId
            };
          } else if (patientDefaultPaymentPlan.planType === 'family') {
            covered = {
              coverType: patientDefaultPaymentPlan.planType,
              familyId: patientDefaultPaymentPlan.planDetails.familyId
            };
          }
          billingItems.forEach(element => {
            bill.push({
              unitPrice: element.cost,
              facilityId: facilityId,
              facilityServiceId: element.facilityServiceId,
              serviceId: element.serviceId,
              patientId: prescription.patientId,
              quantity: element.quantity,
              active: true,
              totalPrice: element.totalCost,
              covered: covered
            });
          });

          try {
            let createBill = await billCreatorService.create(bill, {
              query: {
                facilityId: facilityId,
                patientId: prescription.patientId
              }
            });
            if (createBill.length > 0) {
              createBill = createBill[0];
              // Update prescription items with
              createBill.billItems.forEach(bill => {
                prescription.prescriptionItems.forEach(prescribe => {
                  if (bill.serviceId.toString() === prescribe.serviceId) {
                    // Update prescription items with billingId
                    prescribe.billItemId = bill._id;
                    prescribe.billId = createBill._id;
                  }
                });
              });

              try {
                const createPrescription = await prescriptionService.create(prescription);
                if (createPrescription._id !== undefined) {
                  return jsend.success(createPrescription);
                } else {
                  return jsend.error('There was a problem trying to create prescription');
                }
              } catch (e) {
                return jsend.error('There was a problem trying to create prescription');
              }
            } else {
              return jsend.error('There was a problem trying to create prescription');
            }
          } catch (e) {
            return jsend.error('There was a problem trying to generate bill');
          }
        } else {
          try {
            const createPrescription =
              await prescriptionService.create(prescription);

            if (createPrescription._id !== undefined) {
              return jsend.success(createPrescription);
            } else {
              return jsend.error(
                'There was a problem trying to create prescription');
            }
          } catch (e) {
            return jsend.error('There was a problem trying to create prescription');
          }
        }
      } else {
        return jsend.error('You have not been assigned to this facility.');
      }
    } else {
      return jsend.error('You need to log in to perform this transaction');
    }
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
