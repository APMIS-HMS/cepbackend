/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    const patientsService = this.app.service('patients');
    const savePersonService = this.app.service('save-person');
    const billCreatorService = this.app.service('bill-creators');
    // const familiesService = this.app.service('families');

    const person = data.person;
    const paymentPlan = data.paymentPlan;
    const facilityId = data.facilityId;
    const billing = data.billing;

    try {
      const savedPerson = await savePersonService.create(person, {});

      paymentPlan.map(plan => {
        bearerPersonId: savedPerson._id
      })
      const patient = {
        personId: savedPerson._id,
        facilityId: facilityId,
        paymentPlan: paymentPlan
      };

      const savedPatient = await patientsService.create(patient, {});

      billing.map(bill => {
        bill.patientId = savedPatient._id;
      });

      const savedBill = await billCreatorService.create(billing, {
        query: {
          facilityId: facilityId,
          patientId: savedPatient._id
        }
      });


      return {
        savedPerson,
        savedPatient,
        savedBill
      };
    } catch (error) {
      return error;
    }


  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
