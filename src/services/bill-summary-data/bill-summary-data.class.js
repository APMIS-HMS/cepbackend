const jsend = require('jsend');
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

  async get(id, params) {
    const billingsService = this.app.service('billings');
    const invoicesService = this.app.service('invoices');
    let totalAmountUnpaidBills = 0;
    let totalAmountUnpaidInvoice = 0;
    let totalAmountPaidInvoice = 0;
    const bills = await billingsService.find({
      query: {
        facilityId: id,
        $or: [{
          'billItems.covered.coverType': 'wallet'
        },
        {
          'billItems.covered.coverType': 'family'
        }
      ],
      'billItems.isInvoiceGenerated':false,
      $select:['billItems.isInvoiceGenerated','billItems.covered','billItems.totalPrice']
      }
    });
    console.log(bills.data[0].billItems);
    for (let i = bills.data.length - 1; i >= 0; i--) {
      bills.data[i].billItems.filter(x => x.isInvoiceGenerated === false).map(element => {
        if (element.covered !== undefined) {
          if (element.covered.coverType !== 'insurance' && element.covered.coverType !== 'company') {
            totalAmountUnpaidBills += element.totalPrice;
          }
        }
      });
    }
    const invoicesAmountUnpaidInvoice = await invoicesService.find({
      query: {
        facilityId: id,
        $or: [{
          paymentCompleted: false
        },
        {
          paymentCompleted: true
        }
      ],
      $select:['balance','paymentCompleted','totalPrice']
      }
    });
    for (let i = invoicesAmountUnpaidInvoice.data.length - 1; i >= 0; i--) {
      if(!invoicesAmountUnpaidInvoice.data[i].paymentCompleted){
        totalAmountUnpaidInvoice += invoicesAmountUnpaidInvoice.data[i].balance;
      }else{
        totalAmountPaidInvoice += (invoicesAmountUnpaidInvoice.data[i].totalPrice - invoicesAmountUnpaidInvoice.data[i].balance);
      }
    }
    
    let returnValue = {
      PaidIvoices: totalAmountPaidInvoice,
      UnpaidInvoices: totalAmountUnpaidInvoice,
      UnpaidBills: totalAmountUnpaidBills
    };
    return jsend.success(returnValue);
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
