/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    let result = [];
    const hmoService = this.app.service('hmos');
    const facilityService = this.app.service('facilities');
    let findHmoService = await hmoService.find({
      query: {
        facilityId: params.query.facilityId,
        $limit: false
      }
    });
    if (findHmoService.data.length > 0) {
      let len = findHmoService.data.length - 1;
      for (let i = len; i >= 0; i--) {
        if (findHmoService.data[i].hmos.length > 0) {
          let len2 = findHmoService.data[i].hmos.length - 1;
          for (let j = len2; j >= 0; j--) {
            let facility = await facilityService.find({
              query: {
                '_id': findHmoService.data[i].hmos[j].hmo
              }
            });
            let res = {
              hmoId: findHmoService.data[i].hmos[j].hmo,
              hmoName: facility.data[0].name,
              enrollees: findHmoService.data[i].hmos[j].enrolleeList
            };
            result.push(res);
          }
        }
      }
    }
    return result;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  async patch(id, data, params) {
    const hmoService = await this.app.service('hmos');
    let hmo = await hmoService.find({
      query: {
        'facilityId': params.query.facilityId
      }
    });
    if (hmo.data.length > 0) {
      let index = hmo.data[0].hmos.findIndex(x => x.hmo.toString() === params.query.hmoId.toString());
      if (index > -1) {
        if (hmo.data[0].hmos[index].enrolleeList.length > 0) {
          let updatedData = JSON.parse(JSON.stringify(hmo.data[0]));
          if (id !== '') {
              let verifyUpdate = false;
            updatedData.hmos[index].enrolleeList.forEach(element => {
                if(verifyUpdate === false){
                    verifyUpdate = true;
                    element.enrollees[id].firstname = data.firstname.toUpperCase();
                    element.enrollees[id].surname = data.surname.toUpperCase();
                    element.enrollees[id].category = data.category.toUpperCase();
                    element.enrollees[id].serial = data.serial;
                    element.enrollees[id].sponsor = data.sponsor.toUpperCase();
                    element.enrollees[id].type = data.type.toUpperCase();
                    element.enrollees[id].plan = data.plan.toUpperCase();
                    element.enrollees[id].gender = data.gender.toUpperCase();
                    element.enrollees[id].filNo = data.filNo.toUpperCase();
                    element.enrollees[id].date = data.date;
                    element.enrollees[id].status = data.status;
                }
            });
          } else {
            updatedData.hmos[index].enrolleeList[updatedData.hmos[index].enrolleeList.length -1].enrollees.push({
              firstname: data.firstname.toUpperCase(),
              surname: data.surname.toUpperCase(),
              category: data.category.toUpperCase(),
              serial: (updatedData.hmos[index].enrolleeList.length + 1),
              sponsor: data.sponsor.toUpperCase(),
              type: data.type.toUpperCase(),
              plan: data.plan.toUpperCase(),
              gender: data.gender.toUpperCase(),
              filNo: data.filNo.toUpperCase(),
              date: new Date(),
              status: data.status
            });
          }

          let _updatedData = JSON.parse(JSON.stringify(updatedData));
          let updatedBeneficiary = await hmoService.patch(_updatedData._id, _updatedData, {});
          return updatedBeneficiary;
        }
      } else {
        return {};
      }
    }
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
