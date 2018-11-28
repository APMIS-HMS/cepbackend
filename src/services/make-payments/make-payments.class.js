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
    const apmisSurchargesService = this.app.service('apmis-surcharges');
    const peopleService = this.app.service('people');
    let currentInvoiceCollection = {};
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
        const awaitBillGroup = await invoicesService.create(billGroup);
        currentInvoiceCollection = awaitBillGroup;
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
          try {
            const pd = await billingsService.update(filterCheckedBills[_indx]._id, filterCheckedBills[_indx], {});
            pds.push(pd);
          } catch (error) {}

        }


        if (data.inputedValue.isWaved !== true) {
          data.invoice = awaitBillGroup;
          return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan, invoicesService, currentInvoiceCollection, apmisSurchargesService);
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
      currentInvoiceCollection = patechedInvoice;
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
        return onDebitWallet(data, description, ref, facilitiesService, peopleService, PaymentPlan, invoicesService, currentInvoiceCollection, apmisSurchargesService);
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

async function onDebitWallet(data, description, ref, facilitiesService, peopleService, paymentPlan, invoicesService, currentInvoiceCollection, apmisSurchargesService) {
  if (data.inputedValue.paymentMethod.planType == paymentPlan.outOfPocket || data.inputedValue.paymentMethod.planType == paymentPlan.family) {
    let getPerson = {};
    if (data.inputedValue.paymentMethod.bearerPersonId !== undefined) {
      getPerson = await peopleService.get(data.inputedValue.paymentMethod.bearerPersonId, {});
      const personWallet = await peopleService.get(data.personId, {
        query: {
          $select: ['wallet']
        }
      });
      getPerson.wallet = personWallet.wallet;
    } else {
      getPerson = await peopleService.get(data.personId, {});
      const personWallet = await peopleService.get(data.personId, {
        query: {
          $select: ['wallet']
        }
      });
      getPerson.wallet = personWallet.wallet;
    }
    let patchedPerson, facility = {};

    facility = await facilitiesService.get(data.facilityId, {});
    const facilityWallet = await facilitiesService.get(data.facilityId, {
      query: {
        $select: ['wallet', 'paymentDistribution']
      }
    });

    facility.wallet = facilityWallet.wallet;
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
    const patchedPersonWallet = await peopleService.get(getPerson._id, {
      query: {
        $select: ['wallet']
      }
    });
    patchedPerson.wallet = patchedPersonWallet.wallet;


    if (data.inputedValue.balance == 0) {
      patchedPerson.isPaid = true;
      patchedPerson.paidStatus = 'PAID';
      patchedPerson.isWaved = false;
    } else {
      patchedPerson.isPaid = false;
      patchedPerson.paidStatus = 'UNPAID';
    }
    const personWallet2 = await peopleService.get(data.personId, {
      query: {
        $select: ['wallet']
      }
    });
    patchedPerson.wallet = personWallet2.wallet;

    //Create surcharges

    const invoiceObject = await invoicesService.get(currentInvoiceCollection._id, {
      query: {
        $select: ['paymentCompleted', 'billingIds.billObject', 'payments']
      }
    });
    
    let totalSurCharge = 0;
    invoiceObject.billingIds.map(x => {
      totalSurCharge += x.billObject.apmisSurCharge;
    });

    const apmisSurchargesObject = await apmisSurchargesService.find({
      query: {
        invoiceId: currentInvoiceCollection._id
      }
    });

    let deductionValue = {};
    let surchargeValue = {};
    if (facilityWallet.paymentDistribution.deductionType === '%') {
      deductionValue = {
        type: '%',
        value: facilityWallet.paymentDistribution.deductionValue,
        status: true
      }
    } else {
      deductionValue = {
        type: 'v',
        value: 10,
        status: false
      }
    }
    if (apmisSurchargesObject.data.length > 0) {
      if (!apmisSurchargesObject.data[0].isSurchargeCompleted) {
        const ptge = data.inputedValue.amountPaid * (deductionValue.value / 100);
        let _deductedValue = apmisSurchargesObject.data[0].deductedValue + ptge;
        if (_deductedValue > apmisSurchargesObject.data[0].invoiceTotalSurcharge) {
          _deductedValue = _deductedValue + (apmisSurchargesObject.data[0].invoiceTotalSurcharge - _deductedValue);
        }
        surchargeValue = {
          facilityId: data.facilityId,
          value: apmisSurchargesObject.data[0].value + data.inputedValue.amountPaid,
          invoiceTotalSurcharge: totalSurCharge,
          isSurchargeCompleted: (_deductedValue === apmisSurchargesObject.data[0].invoiceTotalSurcharge) ? true : false,
          deductedValue: _deductedValue,
          invoiceId: invoiceObject._id
        };
        await apmisSurchargesService.update(apmisSurchargesObject.data[0]._id, surchargeValue);
      } else if (apmisSurchargesObject.data[0].isSurchargeCompleted) {
        apmisSurchargesObject.data[0].value = apmisSurchargesObject.data[0].value + data.inputedValue.amountPaid;
        await apmisSurchargesService.patch(apmisSurchargesObject.data[0]._id, {
          value: apmisSurchargesObject.data[0].value
        }, {});
      }
    } else {
      if (invoiceObject.paymentCompleted) {
        surchargeValue = {
          facilityId: data.facilityId,
          isSurchargeCompleted: true,
          value: data.inputedValue.amountPaid,
          invoiceTotalSurcharge: (facilityWallet.paymentDistribution.deductionType === '%') ? totalSurCharge : facilityWallet.paymentDistribution.deductionValue,
          deductedValue: (facilityWallet.paymentDistribution.deductionType === '%') ? totalSurCharge : facilityWallet.paymentDistribution.deductionValue,
          isPercentage: deductionValue.status,
          invoiceId: invoiceObject._id
        };
      } else {
        let _deductedValue = data.inputedValue.amountPaid * (facilityWallet.paymentDistribution.deductionValue / 100);
        if (facilityWallet.paymentDistribution.deductionType !== '%') {
          _deductedValue = data.inputedValue.amountPaid * (10 / 100);
        }
        surchargeValue = {
          facilityId: data.facilityId,
          value: data.inputedValue.amountPaid,
          invoiceTotalSurcharge: (facilityWallet.paymentDistribution.deductionType === '%') ? totalSurCharge : facilityWallet.paymentDistribution.deductionValue,
          deductedValue: _deductedValue,
          isPercentage: deductionValue.status,
          invoiceId: invoiceObject._id
        };
      }
      await apmisSurchargesService.create(surchargeValue);
    }
    let returnObj = {
      person: patchedPerson,
      invoice: data.currentInvoice
    };
    return jsend.success(returnObj);
  }
}

module.exports.Service = Service;
