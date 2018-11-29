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
  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }
  async create(data, params) {
    const patientsService = this.app.service('patients');
    const billingsService = this.app.service('billings');
    const facilityService = this.app.service('facilities');
    const familiesService = this.app.service('families');
    const facilitySubscriptionStatus = await facilityService.get(params.query.facilityId, {
      query: {
        $select: ['paymentDistribution']
      }
    });
    let billGroup = [];
    const insurance = data.filter(x => x.covered.coverType === 'insurance');
    const wallet = data.filter(x => x.covered.coverType === 'wallet');
    const company = data.filter(x => x.covered.coverType === 'company');
    const family = data.filter(x => x.covered.coverType === 'family');
    //Collection of insurance billitems
    let len = 0;
    if (insurance.length > 0) {
      len = insurance.length;
      for (let index = 0; index < len; index++) {
        const indx = insurance.filter(x => x.covered.hmoId.toString() === insurance[index].covered.hmoId.toString() && x.isPicked === undefined);
        if (indx.length > 0) {
          indx.forEach(x => {
            x.isPicked = true;
          });
          const patient = await patientsService.get(params.query.patientId);
          const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.hmoId !== undefined && x.planDetails.hmoId.toString() === insurance[index].covered.hmoId.toString());
          const _total = sumCost(indx, {});
          const billModel = {
            'facilityId': params.query.facilityId,
            'grandTotal': _total.totalCost,
            'coverFile': {
              'id': patientPaymentType[0].planDetails.principalId,
              'name': patientPaymentType[0].planDetails.hmoName
            },
            'subTotal': _total.totalCost,
            'totalCost': _total.totalCostValue,
            'discount': 0,
            'billItems': indx
          };
          billGroup.push(billModel);
        }
      }
    }
    //Collection of Company Billitems
    if (company.length > 0) {
      len = company.length;
      for (let index = 0; index < len; index++) {
        const indx = company.filter(x => x.covered.companyId.toString() === company[index].covered.companyId.toString() && x.isPicked === undefined);
        if (indx.length > 0) {
          indx.forEach(x => {
            x.isPicked = true;
          });
          const patient = await patientsService.get(params.query.patientId);
          const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.companyId.toString() === company[index].covered.companyId.toString());
          const _total = sumCost(indx, facilitySubscriptionStatus.paymentDistribution);
          const billModel = {
            'facilityId': params.query.facilityId,
            'grandTotal': _total.totalCost,
            'coverFile': {
              'id': patientPaymentType[0].planDetails.principalId,
              'name': patientPaymentType[0].planDetails.hmoName
            },
            'subTotal': _total.totalCost,
            'totalCost': _total.totalCostValue,
            'discount': 0,
            'billItems': indx
          };
          billGroup.push(billModel);
        }
      }
    }
    //Collection of Family BillItems
    if (family.length > 0) {
      let familyPrincipal = {};
      len = family.length;
      for (let index = 0; index < len; index++) {
        const indx = family.filter(x => x.covered.familyId.toString() === family[index].covered.familyId.toString() && x.isPicked === undefined);
        if (indx.length > 0) {
          indx.forEach(x => {
            x.isPicked = true;
          });
          const patient = await patientsService.get(params.query.patientId);
          const patientPaymentType = patient.paymentPlan.filter(x => x.planDetails.familyId !== undefined && x.planDetails.familyId.toString() === family[index].covered.familyId.toString());
          const familyCoveredDetails = await familiesService.get(patientPaymentType[0].planDetails.familyId);
          if (familyCoveredDetails !== null) {
            familyPrincipal = familyCoveredDetails.familyCovers.find(x => x.serial === 0);
          }
          const _total = sumCost(indx, facilitySubscriptionStatus.paymentDistribution);
          const billModel = {
            'facilityId': params.query.facilityId,
            'patientId': familyPrincipal.patientId,
            'grandTotal': _total.totalCost,
            'coverFile': {
              'id': patientPaymentType[0].planDetails.principalId,
              'name': patientPaymentType[0].planDetails.principalName
            },
            'subTotal': _total.totalCost,
            'totalCost': _total.totalCostValue,
            'discount': 0,
            'billItems': indx
          };
          billGroup.push(billModel);
        }
      }
    }

    //Collection of Wallet Billitems
    if (wallet.length > 0) {
      wallet.forEach(x => {
        x.isBearerConfirmed = true;
      });
      const _total = sumCost(wallet, facilitySubscriptionStatus.paymentDistribution);
      const billModel = {
        'facilityId': params.query.facilityId,
        'grandTotal': _total.totalCost,
        'patientId': params.query.patientId,
        'subTotal': _total.totalCost,
        'totalCost': _total.totalCostValue,
        'billItems': wallet
      };
      billGroup.push(billModel);
    }
    const bills = await billingsService.create(billGroup);
    return bills;
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

function sumCost(billItems, facilityDeductionPlan) {
  let totalCost = 0;
  let totalCostValue = 0;
  billItems.map(element => {
    let sumCharge = element.quantity * element.unitPrice;
    let subCharge = (facilityDeductionPlan.deductionValue / 100) * element.unitPrice;
    if (element.active == true || element.active === undefined) {
      if (facilityDeductionPlan.deductionType === '%') {
        if (subCharge <= facilityDeductionPlan.deductionCap) {
          element.apmisSurCharge = subCharge * element.quantity;
          totalCostValue += sumCharge;
          element.unitPrice = element.unitPrice + (element.apmisSurCharge / element.quantity);
          element.totalPrice = sumCharge + element.apmisSurCharge;
          totalCost += element.totalPrice;
        } else {
          element.apmisSurCharge = facilityDeductionPlan.deductionCap;
          totalCostValue += sumCharge;
          element.unitPrice = element.unitPrice + element.apmisSurCharge;
          element.totalPrice = sumCharge + element.apmisSurCharge;
          totalCost += element.totalPrice;
        }
      } else if (facilityDeductionPlan.deductionType === 'v') {
        if (facilityDeductionPlan.deductionValue <= facilityDeductionPlan.deductionCap) {
          element.apmisSurCharge = facilityDeductionPlan.deductionValue;
          totalCostValue += sumCharge;
          element.unitPrice = element.unitPrice + element.apmisSurCharge;
          element.totalPrice = sumCharge + element.apmisSurCharge;
          totalCost += element.totalPrice;
        } else {
          element.apmisSurCharge = facilityDeductionPlan.deductionCap;
          totalCostValue += sumCharge;
          element.unitPrice = element.unitPrice + element.apmisSurCharge;
          element.totalPrice = sumCharge + element.apmisSurCharge;
          totalCost += element.totalPrice;
        }
      } else {
        element.totalPrice = element.quantity * element.unitPrice;
        totalCostValue += element.totalPrice;
        totalCost += element.totalPrice;
      }
    }
  });
  const result = {
    totalCost: totalCost,
    totalCostValue: totalCostValue
  };
  return result;
}
module.exports.Service = Service;
