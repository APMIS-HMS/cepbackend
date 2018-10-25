/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const patientIdsService = this.app.service('patients');
    const peopleService = this.app.service('people');
    let patients = await patientIdsService.find({
      query: {
        facilityId: params.query.facilityId,
        $limit: false
      }
    });
    const patientIds = patients.data.map(x => x.personId);
    let people = await peopleService.find({
      query: {
        '_id': {
          $in: patientIds
        },
        $limit: false
      }
    })
    return people.data.map(person => {
      return {
        "title": person.title,
        fName: person.firstName,
        lName: person.lastName,
        sex: person.gender,
        dob: person.dateOfBirth,
        motherName: person.motherMaidenName,
        phone: person.primaryContactPhoneNo,
        nextKin: person.nextOfKin.map(next => {
          return {
            nextfullName: next.fullName,
            nextPhone: next.phoneNumber,
            nextRelationship: next.relationship,
            nextEmail: next.email,
            nextAddress: next.address
          }
        }),
        address: person.homeAddress === undefined ? '' : person.homeAddress.street + ' ' + person.homeAddress.city
      }
    })
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
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

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
