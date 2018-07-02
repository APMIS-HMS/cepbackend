/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
const tokenLabel = require('../../parameters/token-label');
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
    const ref = generateOtp();
    const billingsService = this.app.service('billings');
    const invoicesService = this.app.service('invoices');
    const facilitiesService = this.app.service('facilities');
    const getTokenService = this.app.service('get-tokens');
    const orgServices = this.app.service('organisation-services');
    const peopleService = this.app.service('people');
    const subscriptionsService = this.app.service('apmis-subscriptions');
    const facilitySubscriptionUrl = await subscriptionsService.find({
      query: {
        facilityId: data.facilityId
      }
    });
    if (facilitySubscriptionUrl.status === 'success') {
      let existingSubscription = facilitySubscriptionUrl;
      let description = '';
      if (data.isInvoicePage == false) {
        const tokenPayload = await getTokenService.get(tokenLabel.tokenType.invoiceNo, {});
        let billGroup = {
          billingIds: []
        };
        billGroup.facilityId = data.facilityId;
        billGroup.patientId = data.patientId;
        data.billGroups.forEach((itemg, g) => {
          itemg.bills.forEach((itemb, b) => {
            if (itemb.isChecked) {
              if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                itemb.billObject.isServiceEnjoyed = true;
              }
              if (data.inputedValue.balance == 0) {
                itemb.billObject.paymentCompleted = true;
              }
              itemb.billObject.quantity = itemb.qty;
              itemb.billObject.totalPrice = itemb.amount;
              itemb.billObject.isServiceEnjoyed = true;
              itemb.billObject.isInvoiceGenerated = true;
              itemb.billObject.updatedAt = new Date;
              description += itemb.billObject.facilityServiceObject.category + '-' + itemb.billObject.facilityServiceObject.service;
              billGroup.billingIds.push({
                billingId: itemb._id,
                billObject: itemb.billObject,
                billModelId: itemb.billModelId
              });
            }
          });
        });

        if (billGroup.billingIds.length > 0) {
          billGroup.payments = [];
          billGroup.totalDiscount = data.discount;
          billGroup.subTotal = data.subTotal;
          billGroup.totalPrice = data.inputedValue.cost;
          billGroup.balance = data.inputedValue.balance;
          billGroup.createdBy = data.createdBy;
          billGroup.invoiceNo = tokenPayload.result;
          data.inputedValue.paymentMethod.reason = data.reason;
          billGroup.payments = data.inputedValue.paymentTxn;
          if (data.inputedValue.balance == 0) {
            billGroup.paymentStatus = 'PAID';
            billGroup.paymentCompleted = true;
          }
          if (data.inputedValue.isWaved == true) {
            billGroup.paymentStatus = 'WAIVED';
            billGroup.paymentCompleted = false;
          }
          if (existingSubscription.data.name === 'Subscription') {
            let subCharge = data.subTotal * (existingSubscription.data.rate / 100);
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
                "description": "Apmis Sub-charge on Invoice " + tokenPayload.result,
                "patientId": data.patientId,
                "facilityId": data.facilityId,
              }
            }
            billGroup.billingIds.push(apmisSubChargeItem);
          }
          const awaitBillGroup = await invoicesService.create(billGroup);
          const len = data.inputedValue.paymentTxn.length - 1;
          const len2 = data.listedBillItems.length - 1;
          let filterCheckedBills = [];
          for (var x = len; x >= 0; x--) {
            for (var x2 = len2; x2 >= 0; x2--) {
              let len3 = data.listedBillItems[x2].billItems.length - 1;
              for (var x3 = len3; x3 >= 0; x3--) {
                if (data.inputedValue.paymentTxn[x].facilityServiceObject.serviceId !== undefined) {
                  if (data.listedBillItems[x2].billItems[x3].serviceId.toString() === data.inputedValue.paymentTxn[x].facilityServiceObject.serviceId.toString()) {
                    data.listedBillItems[x2].billItems[x3].isInvoiceGenerated = true;
                    if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
                      data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                    }
                    if (data.inputedValue.balance == 0) {
                      data.listedBillItems[x2].billItems[x3].paymentCompleted = true;
                    }
                    data.listedBillItems[x2].billItems[x3].isServiceEnjoyed = true;
                    filterCheckedBills.push(data.listedBillItems[x2]);
                  }
                }
              }
            }
          }
          let len4 = filterCheckedBills.length;
          let pds = [];
          for (let _indx = 0; _indx < len4; _indx++) {
            const pd = await billingsService.patch(filterCheckedBills[_indx]._id, {
              billItems: filterCheckedBills[_indx].billItems
            });
            pds.push(pd);
          }



          if (data.inputedValue.isWaved !== true) {
            data.invoice = awaitBillGroup;
            return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan, existingSubscription);
          } else {
            let pd = {};
            pd.isPaid = false;
            pd.isWaved = true;
            pds.push(pd);
            let returnObj = {
              bill: pds,
              invoice: awaitBillGroup
            };
            return returnObj;
          }
        }
      } else {
        if (data.inputedValue.balance === 0) {
          data.invoice.paymentCompleted = true;
          data.invoice.paymentStatus = 'PAID';
        }
        if (data.inputedValue.balance > 0) {
          data.invoice.paymentCompleted = false;
          data.invoice.paymentStatus = 'UNPAID';
        }
        if (data.inputedValue.isWaved == true) {
          data.invoice.paymentStatus = 'WAIVED';
        }
        let invLen = data.invoice.billingIds.length - 1;
        for (let v = invLen; v >= 0; v--) {
          data.invoice.billingIds[v].billObject.isServiceEnjoyed = true;
          data.invoice.billingIds[v].billObject.balance = data.inputedValue.balance;
          if (data.inputedValue.balance == 0 || data.inputedValue.isWaved == true) {
            data.invoice.billingIds[v].billObject.isServiceEnjoyed = true;
          }
          if (data.inputedValue.balance == 0) {
            data.invoice.billingIds[v].billObject.paymentCompleted = true;
          }
          if (data.invoice.billingIds[v].billObject.facilityServiceId !== undefined) {
            const getOrgServiceItem = await orgServices.get(data.invoice.billingIds[v].billObject.facilityServiceId);
            if (getOrgServiceItem._id !== undefined) {
              let categoryLabel = getOrgServiceItem.categories.forEach(element => {
                element.services.forEach(ele => {
                  if (ele._id.toString() === data.invoice.billingIds[v].billObject.serviceId) {
                    description += element.name + ' - ' + ele.name;
                    return;
                  }
                });
              });
            }
          }
        }

        data.invoice.balance = data.inputedValue.balance;
        data.inputedValue.paymentMethod.reason = data.reason;
        data.invoice.payments.forEach(element => {
          element.isItemTxnClosed = true;
        });
        if (data.invoice.payments.length > 0) {
          data.invoice.payments.push.apply(data.invoice.payments, data.inputedValue.paymentTxn);
        }
        const patechedInvoice = await invoicesService.patch(data.invoice._id, {
          billingIds: data.invoice.billingIds,
          balance: data.invoice.balance,
          payments: data.invoice.payments,
          createdBy: data.createdBy,
          paymentStatus: data.invoice.paymentStatus,
          paymentCompleted: data.invoice.paymentCompleted
        });
        let len5 = patechedInvoice.billingIds.length - 1;
        let itemBill = {};
        for (let m = len5; m >= 0; m--) {
          if (patechedInvoice.billingIds[m].billModelId !== undefined) {
            itemBill = await billingsService.get(patechedInvoice.billingIds[m].billModelId, {});
            let len6 = itemBill.billItems.length - 1;
            for (let n = len6; n >= 0; n--) {
              if (itemBill.billItems[n].serviceId.toString() === patechedInvoice.billingIds[m].billObject.serviceId.toString()) {
                if (data.inputedValue.balance === 0 || data.inputedValue.isWaved === true) {
                  itemBill.billItems[n].isServiceEnjoyed = true;
                }
                if (data.inputedValue.balance === 0) {
                  itemBill.billItems[n].paymentCompleted = true;
                }
                itemBill.billItems[n].isServiceEnjoyed = true;
              }
            }
            await billingsService.patch(itemBill._id, {
              billItems: itemBill.billItems
            });
          }
        }
        if (data.inputedValue.isWaved !== true) {
          data.currentInvoice = patechedInvoice;
          return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan, existingSubscription);
        } else {
          itemBill.isPaid = false;
          itemBill.isWaved = true;
          itemBill.paidStatus = 'WAIVED';
          let returnObj = {
            bill: itemBill,
            invoice: patechedInvoice
          };
          return returnObj;
        }
      }
    } else {
      return jsend.fail({});
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

function generateOtp() {
  var otp = '';
  var possible = '0123456789';
  for (var i = 0; i <= 5; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return otp;
}
var PaymentPlan = {
  'outOfPocket': 'wallet',
  'insurance': 'insurance',
  'company': 'company',
  'family': 'family',
  'waved': 'waved',
};
module.exports = function (options) {
  return new Service(options);
};

async function onDebitWallet(data, description, ref, facilitiesService, peopleService, paymentPlan, existingSubscription) {
  // if (data.inputedValue.paymentMethod.planType == paymentPlan.company || data.inputedValue.paymentMethod.planType == paymentPlan.insurance) {
  //   let facility = {};
  //   if (data.inputedValue.paymentMethod.facilityId !== undefined) {
  //     facility = await facilitiesService.get(data.inputedValue.paymentMethod.facilityId, {});
  //   } else {
  //     facility = await peopleService.get(data.personId, {});
  //   }
  //   let currentBalance = parseInt(facility.wallet.balance) - parseInt(data.inputedValue.amountPaid);
  //   facility.wallet.balance = currentBalance;
  //   facility.wallet.ledgerBalance = currentBalance;
  //   facility.wallet.transactions.push({
  //     'transactionType': data.inputedValue.transactionType,
  //     'amount': data.inputedValue.amountPaid,
  //     'refCode': ref,
  //     'description': description,
  //     'transactionMedium': data.inputedValue.paymentMethod.planType,
  //     'transactionStatus': data.transactionStatus,
  //     'balance': currentBalance,
  //     'ledgerBalance': currentBalance
  //   });
  //   const patchedFacility = facilitiesService.patch(facility._id, {
  //     wallet: facility.wallet
  //   });

  //   if (data.inputedValue.balance == 0) {
  //     patchedFacility.isPaid = true;
  //     patchedFacility.isWaved = false;
  //     patchedFacility.paidStatus = 'PAID';
  //   } else {
  //     patchedFacility.paidStatus = 'UNPAID';
  //     patchedFacility.isPaid = false;
  //   }

  //   let returnObj = {
  //     facility: patchedFacility,
  //     invoice: data.currentInvoice
  //   };
  //   return returnObj;
  // }
  if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    let getPerson = {};
    if (data.inputedValue.paymentMethod.bearerPersonId !== undefined) {
      getPerson = await peopleService.get(data.inputedValue.paymentMethod.bearerPersonId, {});
    } else {
      getPerson = await peopleService.get(data.personId, {});
    }

    let patchedPerson, facility = {};
    if (existingSubscription.status === 'success') {
      facility = await facilitiesService.get(data.facilityId, {});
      if (existingSubscription.data.name === 'Subscription') {
        let apmis_sub_charge = data.subTotal * (existingSubscription.data.rate / 100);
        let currentBalance = parseInt(getPerson.wallet.balance) + (data.inputedValue.cost + apmis_sub_charge);
        getPerson.wallet.balance = currentBalance;
        getPerson.wallet.ledgerBalance = currentBalance;
        getPerson.wallet.transactions.push({
          'transactionType': data.inputedValue.transactionType,
          'amount': data.inputedValue.amountPaid,
          'refCode': ref,
          'transactionMedium': data.inputedValue.paymentMethod.planType,
          'description': description,
          'transactionStatus': data.transactionStatus,
          'balance': currentBalance,
          'ledgerBalance': currentBalance
        });
        patchedPerson = await peopleService.patch(getPerson._id, {
          wallet: getPerson.wallet
        });
        let facilityBalance = parseInt(facility.wallet.balance) + data.inputedValue.amountPaid;
        facility.wallet.balance = facilityBalance;
        facility.wallet.ledgerBalance = facilityBalance;
        facility.wallet.transactions.push({
          'transactionType': data.inputedValue.transactionType,
          'amount': data.inputedValue.cost,
          'refCode': ref,
          'description': description,
          'transactionMedium': data.inputedValue.paymentMethod.planType,
          'transactionStatus': data.transactionStatus,
          'balance': facilityBalance,
          'ledgerBalance': facilityBalance
        });

        //let apmisPercentage = (parseInt(facility.wallet.amountPaid) * (existingSubscription.data.rate / 100));
        //Code to POST apmisPercentage to Apmis Bank Account.

      } else {  //else if (existingSubscription.data.name === 'One-of-payment') {
        let currentBalance = parseInt(getPerson.wallet.balance) - parseInt(data.inputedValue.amountPaid);
        getPerson.wallet.balance = currentBalance;
        getPerson.wallet.ledgerBalance = currentBalance;
        getPerson.wallet.transactions.push({
          'transactionType': data.inputedValue.transactionType,
          'amount': data.inputedValue.amountPaid,
          'refCode': ref,
          'transactionMedium': data.inputedValue.paymentMethod.planType,
          'description': description,
          'transactionStatus': data.transactionStatus,
          'balance': currentBalance,
          'ledgerBalance': currentBalance
        });
        patchedPerson = await peopleService.patch(getPerson._id, {
          wallet: getPerson.wallet
        });
        let facilityBalance = parseInt(facility.wallet.balance) + parseInt(data.inputedValue.amountPaid);
        facility.wallet.balance = facilityBalance;
        facility.wallet.ledgerBalance = facilityBalance;
        facility.wallet.transactions.push({
          'transactionType': data.inputedValue.transactionType,
          'amount': parseInt(data.inputedValue.amountPaid),
          'refCode': ref,
          'description': description,
          'transactionMedium': data.inputedValue.paymentMethod.planType,
          'transactionStatus': data.transactionStatus,
          'balance': facilityBalance,
          'ledgerBalance': facilityBalance
        });
      }
    } else {
      return jsend.fail({})
    }
    facilitiesService.patch(facility._id, {
      wallet: facility.wallet
    });

    if (data.inputedValue.balance == 0) {
      patchedPerson.isPaid = true;
      patchedPerson.paidStatus = 'PAID';
      patchedPerson.isWaved = false;
    } else {
      patchedPerson.isPaid = false;
      patchedPerson.paidStatus = 'UNPAID';
    }
    let returnObj = {
      person: patchedPerson,
      invoice: data.currentInvoice
    };
    return returnObj;
  }
}

module.exports.Service = Service;
