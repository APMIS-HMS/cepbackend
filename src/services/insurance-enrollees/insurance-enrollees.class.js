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
            for (let indx = 0; indx < updatedData.hmos[index].enrolleeList.length; indx++) {
              const enrolleeIndex = id; //updatedData.hmos[index].enrolleeList[indx].enrollees.findIndex(x => x.filNo.toString() === data.filNo);
              if (enrolleeIndex > -1) {
                let rowObj = updatedData.hmos[index].enrolleeList[indx].enrollees[enrolleeIndex];

                rowObj.serial = data.serial;
                rowObj.surname = data.surname.toUpperCase();
                rowObj.firstname = data.firstname.toUpperCase();
                rowObj.gender = data.gender;
                rowObj.filNo = data.filNo;
                rowObj.category = data.category.toUpperCase();
                rowObj.sponsor = data.sponsor.toUpperCase();
                rowObj.plan = data.plan.toUpperCase();
                rowObj.type = data.type;
                rowObj.status = data.status;
                rowObj.date = data.date;

                updatedData.hmos[index].enrolleeList[indx].enrollees[enrolleeIndex] = rowObj;

                let _updatedData = JSON.parse(JSON.stringify(updatedData));
                let updatedBeneficiary = await hmoService.update(_updatedData._id, _updatedData, {});
                return updatedBeneficiary;
              }
            }
          } else {
            let dt = new Date(data.date);
            let lastMonthEnrolleesIndex = updatedData.hmos[index].enrolleeList.findIndex(x => x.month === dt.getMonth() && x.year === dt.getFullYear());
            if (lastMonthEnrolleesIndex > -1) {
              updatedData.hmos[index].enrolleeList[lastMonthEnrolleesIndex].enrollees.push({
                firstname: data.firstname.toUpperCase(),
                surname: data.surname.toUpperCase(),
                category: data.category.toUpperCase(),
                serial: (updatedData.hmos[index].enrolleeList.length + 1),
                sponsor: data.sponsor.toUpperCase(),
                type: data.type,
                plan: data.plan.toUpperCase(),
                gender: data.gender,
                filNo: data.filNo,
                status: data.status
              });
            } else {
              let enrolleeList = {
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                enrollees: []
              };
              enrolleeList.enrollees.push({
                firstname: data.firstname.toUpperCase(),
                surname: data.surname.toUpperCase(),
                category: data.category.toUpperCase(),
                serial: (updatedData.hmos[index].enrolleeList.length + 1),
                sponsor: data.sponsor.toUpperCase(),
                type: data.type,
                plan: data.plan.toUpperCase(),
                gender: data.gender,
                filNo: data.filNo,
                status: data.status
              });
              updatedData.hmos[index].enrolleeList.push(enrolleeList);
            }

            let _updatedData = JSON.parse(JSON.stringify(updatedData));
            let updatedBeneficiary = await hmoService.patch(_updatedData._id, _updatedData, {});
            return updatedBeneficiary;
          }
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
