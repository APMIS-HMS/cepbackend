/* eslint-disable no-unused-vars */
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
    const personService = this.app.service('people');
    const patientService = this.app.service('patients');
    const billingService = this.app.service('bill-creators');

    const person = {
      title: 'Unknown',
      firstName: 'Unknown',
      lastName: 'Unknown',
      gender: (data.gender === null || data.gender === undefined) ? 'Not Identified' : data.gender,
      motherMaidenName: 'Unknown',
      primaryContactPhoneNo: ' '
    };

    const savedPerson = await personService.create(person);
    const patient = {
      personId: savedPerson._id,
      facilityId: data.facilityId,
      isActive: true,
      paymentPlan: [{
        planDetails: false,
        isDefault: true,
        bearerPersonId: savedPerson._id,
        planType: 'wallet'
      }],
      tags: [data.tag]
    };
    const savedPatient = await patientService.create(patient);
    const billing = [{
      unitPrice: data.unitPrice,
      facilityId: data.facilityId,
      description: '',
      facilityServiceId: data.facilityServiceId,
      serviceId: data.planId,
      patientId: savedPatient._id,
      quantity: 1,
      totalPrice: data.unitPrice,
      unitDiscountedAmount: 0,
      totalDiscoutedAmount: 0,
      modifierId: [],
      covered: {
        coverType: data.coverType
      },
      isServiceEnjoyed: false,
      paymentCompleted: false,
      paymentStatus: [],
      payments: []

    }];
    
    await billingService.create(billing, {
      query: {
        facilityId: data.facilityId,
        patientId: savedPatient._id
      }
    });
    
    return savedPatient;
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
