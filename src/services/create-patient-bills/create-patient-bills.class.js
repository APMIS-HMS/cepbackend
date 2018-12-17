/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  set(app) {
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
    const makePaymentService = this.app.service('make-payments');
    const patientService = this.app.service('patients');
    const personService = this.app.service('peoples');
    const billCreatorService = this.app.service('bill-creators');
    const familyService = this.app.service('families');

    let patientItem = {
      personId: data.personId,
      facilityId: data.facilityId,
      paymentPlan: [{
        planType: "wallet",
        bearerPersonId: data.personId,
        isDefault: true,
      }]
    };
    if (data.coverType === 'insurance') {
      patientItem.paymentPlan[0].isDefault = false;
      patientItem.paymentPlan.push({
        planType: data.coverType,
        isDefault: true,
        planDetails: {
          hmoId: data.cover.id,
          hmoName: data.cover.name,
          principalId: data.cover.fileNo
        }
      });
    } else if (data.coverType === 'family') {
      patientItem.paymentPlan[0].isDefault = false;
      const poliyFile = await familyService.find({
        query: {
          'familyCovers.filNo': data.cover.fileNo
        }
      });
      const bearerPatient = poliyFile.data[0].familyCovers.find(x => x.serial === 0);
      const bearerPersonId = await personService.get(bearerPatient);
      patientItem.paymentPlan.push({
        planType: data.coverType,
        bearerPersonId: bearerPersonId._id,
        planDetails: {
          principalId: bearerPatient.filNo,
          principalName: bearerPersonId.firstName + ' ' + bearerPersonId.lastName,
          familyId: poliyFile.data[0]._id
        },
        isDefault: true
      });
    }
    const addedPatient = await patientService.create(patientItem);
    const billItem = {
      unitPrice: data.cost,
      facilityId: data.facilityId,
      facilityServiceId: data.facilityServiceId,
      serviceId: data.serviceId,
      patientId: data.patientId,
      quantity: data.quantity,
      active: true,
      totalPrice: data.totalCost,
      covered: {
        coverType: data.coverType
      }
    };

    const createdBill = await billCreatorService.create(
      billItem, {
        query: {
          facilityId: data.facilityId,
          patientId: addedPatient._id
        }
      });
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
