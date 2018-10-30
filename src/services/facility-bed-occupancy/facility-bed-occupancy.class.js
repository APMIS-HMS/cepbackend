const { forEach } = require('p-iteration');

/* eslint-disable no-unused-vars */
class Service {

  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }
  find (params) {
    return Promise.resolve([]);
  }

  async get (id, params) {
    const facilitiesService = this.app.service('facilities');
    let facility = [];
    let minorLocations = [];
    let wardsInFacilitySetup = [];
    let roomsInWard = [];
    let rooms = [];
    let beds = [];
    let pbeds = [];
    if(id != undefined){
      facility = await facilitiesService.get(id, {});
    }
    
    facility.minorLocations.map(i => {
      minorLocations.push(i) ;
    });
    
    minorLocations.map(m => {
      if(m.wardSetup != null || m.wardSetup != undefined) {
        wardsInFacilitySetup.push(m.wardSetup);
      }
    });

    wardsInFacilitySetup.map(w => {
      if(w.rooms.length > 1 || w.rooms != null) {
        roomsInWard.push(w.rooms);
      }
    });


    roomsInWard[0].map(r => {
      beds.push(r);
    });

    return beds;
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
