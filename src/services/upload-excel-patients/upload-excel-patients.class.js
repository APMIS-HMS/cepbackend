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
      rowObj.title = (data[i][0] !== null) ? data[i][0] : ' ';
      rowObj.firstName = (data[i][1] !== null) ? data[i][1] : ' ';
      rowObj.lastName = (data[i][2] !== null) ? data[i][2] : ' ';
      rowObj.gender = (data[i][3] !== null) ? data[i][3] : ' ';
      rowObj.dateOfBirth = (new Date() >= new Date(data[i][4])) ? new Date(data[i][4]) : new Date();
      rowObj.street = (data[i][5] !== null) ? data[i][5] : ' ';
      rowObj.lga = (data[i][6] !== null) ? data[i][6] : ' ';
      rowObj.state = (data[i][7] !== null) ? data[i][7] : ' ';
      rowObj.country = (data[i][8] !== null) ? data[i][8] : ' ';
      rowObj.homeAddress = {
        street: rowObj.street,
        lga: rowObj.lga,
        state: rowObj.state,
        country: rowObj.country
      }
      rowObj.email = (data[i][9] !== null) ? data[i][9] : ' ';
      rowObj.hospId = (data[i][10] !== null) ? data[i][10] : '';
      rowObj.primaryContactPhoneNo = (data[i][11] !== null) ? data[i][11] : ' ';
      rowObj.motherMaidenName = (data[i][12] !== null) ? data[i][12] : ' ';
      rowObj.maritalStatus = (data[i][13] !== null) ? data[i][13] : ' ';
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
