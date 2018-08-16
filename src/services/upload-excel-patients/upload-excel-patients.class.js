/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
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
    data.splice(0, 1);
    let len = data.length;
    let arr = [];
    this.uploadItemTotal = len - 1;
    for (let i = 0; i < len; i++) {
      this.uploadingLoading = true;
      this.uploadItemCounter = i;
      const rowObj = {};
      rowObj.homeAddress = {};
      rowObj.title = (data[i][0] !== undefined) ? data[i][0] : ' ';
      rowObj.firstName = (data[i][1] !== undefined) ? data[i][1] : ' ';
      rowObj.lastName = (data[i][2] !== undefined) ? data[i][2] : ' ';
      rowObj.gender = (data[i][3] !== undefined) ? data[i][3] : ' ';
      rowObj.dateOfBirth = (new Date() >= new Date(data[i][4])) ? new Date(data[i][4]) : new Date();
      rowObj.street = (data[i][5] !== undefined) ? data[i][5] : ' ';
      rowObj.lga = (data[i][6] !== undefined) ? data[i][6] : ' ';
      rowObj.state = (data[i][7] !== undefined) ? data[i][7] : ' ';
      rowObj.country = (data[i][8] !== undefined) ? data[i][8] : ' ';
      rowObj.homeAddress = {
        street: rowObj.street,
        lga: rowObj.lga,
        state: rowObj.state,
        country: rowObj.country
      }
      rowObj.email = (data[i][9] !== undefined) ? data[i][9] : ' ';
      rowObj.hospId = (data[i][10] !== undefined) ? data[i][10] : '';
      rowObj.primaryContactPhoneNo = (data[i][11] !== undefined) ? data[i][11] : ' ';
      rowObj.motherMaidenName = (data[i][12] !== undefined) ? data[i][12] : ' ';
      rowObj.maritalStatus = (data[i][13] !== undefined) ? data[i][13] : ' ';
      rowObj.lgaOfOrigin = (data[i][14] !== undefined) ? data[i][14] : ' ';
      rowObj.stateOfOrigin = (data[i][15] !== undefined) ? data[i][15] : ' ';
      rowObj.nationality = (data[i][16] !== undefined) ? data[i][16] : ' ';
      rowObj.payPlan = 'Wallet';
      arr.push(rowObj);
    }
    return arr;
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
