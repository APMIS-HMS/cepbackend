/* eslint-disable no-unused-vars */
const tokenLabel = require('../../parameters/token-label');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    let billGroups = {};
    const billingsService = this.app.service('billings');
    const facilityItemService = this.app.service('facility-service-items');

    let awaitBills = await billingsService.find({
      query: {
        facilityId: params.query.facilityId,
        patientId: params.query.patientId,
        isinvoice: params.query.isinvoice,
        'billItems.isInvoiceGenerated':false,
        $limit:false,
        $sort: {
          updatedAt: -1
        }
      }
    });
    let results = await facilityItemService.create(awaitBills.data, {});
    return fixedGroupExisting(results);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data) {
    const billingsService = this.app.service('billings');
    const getTokenService = this.app.service('get-tokens');
    const invoicesService = this.app.service('invoices');
    const subscriptionsService = this.app.service('apmis-subscriptions');
    const existingSub = await subscriptionsService.find({
      query: {
        facilityId: data.facilityId
      }
    });

    if (data.checkBillitems.length > 0) {
      const billGroup = {
        billingIds: []
      };
      billGroup.facilityId = data.facilityId;
      billGroup.patientId = data.patientId;
      billGroup.payments = [];
      const awaitToken = await getTokenService.get(tokenLabel.tokenType.invoiceNo, {});
      data.billGroups.forEach((itemg, g) => {
        itemg.bills.forEach((itemb, b) => {
          if (itemb.isChecked) {
            itemb.billObject.isInvoiceGenerated = true;
            billGroup.billingIds
              .push({
                billingId: itemb._id,
                billObject: itemb.billObject,
                billModelId: itemb.billModelId
              });
            billGroup.payments.push({
              paymentDate: new Date,
              date: itemb.billObject.updatedAt,
              qty: itemb.billObject.quantity,
              facilityServiceObject: itemb.billObject.facilityServiceObject,
              amountPaid: 0,
              isSubCharge: false,
              totalPrice: itemb.billObject.totalPrice,
              balance: itemb.billObject.totalPrice,
              isPaymentCompleted: false,
              isWaiver: false,
              waiverComment: '',
              createdBy: ''
            });
            if (existingSub.data.name === 'Subscription') {
              let subCharge = data.subTotal * (existingSub.data.rate / 100);
              const apmisSubChargeItem = {
                "billObject": {
                  "facilityServiceObject": {
                    "service": "Apmis Sub-charge",
                    "category": "Apmis Sub-charge"
                  },
                  "paymentCompleted": false,
                  "isServiceEnjoyed": true,
                  "isInvoiceGenerated": true,
                  "active": true,
                  "modifierId": [],
                  "unitPrice": subCharge,
                  "totalPrice": subCharge,
                  "isSubCharge": true,
                  "quantity": 1,
                  "description": "Apmis Sub-charge on Invoice " + awaitToken.result,
                  "patientId": data.patientId,
                  "facilityId": data.facilityId,
                }
              }
              billGroup.billingIds.push(apmisSubChargeItem);

              billGroup.payments.push({
                paymentDate: new Date,
                date: itemb.billObject.updatedAt,
                qty: 1,
                facilityServiceObject: {
                  "service": "Apmis Sub-charge",
                  "category": "Apmis Sub-charge"
                },
                amountPaid: 0,
                isSubCharge: true,
                totalPrice: subCharge,
                balance: subCharge,
                isPaymentCompleted: false,
                isWaiver: false,
                waiverComment: ''
              });
            }
          }
        });
      });

      if (billGroup.billingIds.length > 0) {
        billGroup.totalDiscount = data.totalDiscount;
        billGroup.subTotal = data.subTotal;
        billGroup.totalPrice = data.totalPrice;
        billGroup.balance = data.totalPrice;
        if (existingSub.data.name === 'Subscription') {
          let _subCharge = data.subTotal * (existingSub.data.rate / 100);
          billGroup.totalPrice = _subCharge + billGroup.totalPrice;
          billGroup.balance = data.totalPrice;
        }
        billGroup.invoiceNo = awaitToken.result;
        const awaitInvoices = await invoicesService.create(billGroup);
        const len = data.checkBillitems.length - 1;
        const len2 = data.listedBillItems.length - 1;
        const filterCheckedBills = [];
        for (let x = len; x >= 0; x--) {
          for (let x2 = len2; x2 >= 0; x2--) {
            const len3 = data.listedBillItems[x2].billItems.length - 1;
            for (let x3 = len3; x3 >= 0; x3--) {
              if (data.listedBillItems[x2].billItems[x3]._id == data.checkBillitems[x]) {
                data.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                data.listedBillItems[x2].billItems[x3].updatedAt = new Date;
                filterCheckedBills.push(data.listedBillItems[x2]);
                if (x == 0) {
                  const len4 = filterCheckedBills.length - 1;
                  for (let x4 = len4; x4 >= 0; x4--) {
                    var awaitBills = await billingsService.patch(filterCheckedBills[x4]._id, {
                      billItems: filterCheckedBills[x4].billItems
                    });
                    return awaitInvoices;
                  }
                }
              }
            }
          }
        }
      } else {
        var error = 'No bill selected';
        return error;
      }
    }
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

function fixedGroupExisting(results) {
  let billGroups = [];
  let subTotal = 0;
  let total = 0;
  let discount = 0;
  let len5 = results.length - 1;
  let masterBillGroups = [];
  for (let i = len5; i >= 0; i--) {
    masterBillGroups.push(results[i]);
    let len6 = results[i].billItems.length - 1;
    for (let k = len6; k >= 0; k--) {
      if ((results[i].billItems[k].isInvoiceGenerated === false || results[i].billItems[k].isInvoiceGenerated === undefined) && results[i].billItems[k].facilityServiceObject.serviceId !== undefined) {
        let bill = results[i].billItems[k];
        const _id = results[i]._id;
        const inBill = {};
        inBill.amount = bill.totalPrice;
        inBill.itemDesc = bill.description;
        inBill.itemName = bill.facilityServiceObject.service;
        inBill.qty = bill.quantity;
        inBill.covered = bill.covered;
        inBill.unitPrice = bill.unitPrice;
        inBill._id = bill._id;
        inBill.facilityServiceObject = bill.facilityServiceObject;
        inBill.billObject = bill;
        inBill.billModelId = _id;
        const existingGroupList = billGroups.filter(x => x.categoryId !== undefined && x.categoryId.toString() === bill.facilityServiceObject.categoryId.toString());
        if (existingGroupList.length > 0) {
          const existingGroup = existingGroupList[0];
          if (existingGroup.isChecked) {
            bill.isChecked = true;
          }
          existingGroup.bills.push(inBill);
          subTotal = subTotal + existingGroup.total;
          total = subTotal - discount;
          if (existingGroup.bills.length > 5) {
            existingGroup.isOpened = false;
          }
        } else {
          const group = {
            isChecked: false,
            total: 0,
            isOpened: false,
            categoryId: bill.facilityServiceObject.categoryId,
            category: bill.facilityServiceObject.category,
            bills: []
          };
          inBill.isChecked = false;
          group.bills.push(inBill);
          billGroups.push(group);
          billGroups.sort(p => p.categoryId);
          total = subTotal - discount;
          group.isOpened = true;
        }
      }
    }
  }

  let uniqueGroupedBill = [];
  billGroups.forEach(item => {
    const index = uniqueGroupedBill.filter(x => x.categoryId.toString() === item.categoryId.toString());
    if (index.length > 0) {
      index[0].bills.push.apply(index[0].bills, item.bills);
    } else {
      uniqueGroupedBill.push(item);
    }
  });
  let _billGroups = {
    'originalCallback': results,
    'billGroups': uniqueGroupedBill,
    'total': total,
    'subTotal': subTotal,
    'discount': discount
  };
  return _billGroups;
}

module.exports = function (options) {
  return new Service(options);
};
module.exports.Service = Service;
