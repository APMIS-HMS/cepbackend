const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const {
  fastJoin,
  softDelete
} = require('feathers-hooks-common');

const extractbill = require('../../hooks/extractbill');
const iscovered = require('../../hooks/check-iscovered');

const resolvers = {
  joins: {
    principalObject: () => async (bill, context) => {
      try {
        if (bill.patientId !== undefined) {
          const patient = await context.app.service('patients').get(bill.patientId, {
            query: {
              $select:['personId']
            }
          });
          bill.principalObject = patient;
        }
      } catch (error) {
        bill.principalObject = {};
      }
    },

    patientObject: () => async (bill, context) => {
      if (context.params.isCoveredPage === true) {
        if (bill.billItems.length > 0) {
          const len = bill.billItems.length - 1;
          for (let index = 0; index <= len; index++) {
            try {
              const patient = await context.app.service('patients').get(bill.billItems[index].patientId, {});
              bill.billItems[index].patientObject = patient;
            } catch (error) {
              bill.billItems[index].patientObject = {};
            }
          }
        }
      }
    },
    serviceObject: () => async (bill, context) => {
      if (context.params.isCoveredPage === true) {
        if (bill.billItems.length > 0) {
          const len = bill.billItems.length - 1;
          for (let index = 0; index <= len; index++) {
            try {
              const serviceItem = await context.app.service('organisation-services').get(bill.billItems[index].facilityServiceId, {});
              if (serviceItem.categories !== undefined) {
                if (serviceItem.categories.length > 0) {
                  const len2 = serviceItem.categories.length - 1;
                  for (let index2 = 0; index2 <= len2; index2++) {
                    const val = serviceItem.categories[index2].services.filter(x => x._id.toString() === bill.billItems[index].serviceId.toString());
                    if (val.length > 0) {
                      bill.billItems[index].serviceObject = val[0];
                    }
                  }
                }
              }
            } catch (error) {
              bill.billItems[index].serviceObject = {};
            }
          }
        }
      }
    }
  }
};

const fixedEditPrice = {
  joins: {
    processEditedPrice: () => async (bill, context) => {
      if (context.type == "before" && context.params.query.hasPriceChanged) {
        context.hasPriceChanged = context.params.query.hasPriceChanged;
        let billItemObjects = bill.billItems.map(x => {
          if (x._id == context.params.query._id) {
            return x
          }
        });
        if (billItemObjects.length > 0) {
          let billItem = billItemObjects[0];
          if (billItem.unitPriceChanges == undefined) {
            billItem.unitPriceChanges = [];
          }
          billItem.unitPriceChanges.push({
            currentPrice: billItem.unitPrice,
            oldPrice: context.params.query.oldPrice,
            userId: context.params.query.createdBy
          });
          bill.billItems.map(x => {
            if (x._id == context.params.query._id) {
              x = billItem;
              return x
            }
          });
        }
        context.params.query = {};
      } else if (context.type == "after" && context.hasPriceChanged) {
        delete context.hasPriceChanged;
        const billObject = await context.app.service('billings').get(bill._id, {});
        const facilityObject = await context.app.service('facilities').get(bill.facilityId, {
          query: {
            $select: ['paymentDistribution']
          }
        });
        const updatedBill = sumBillItems(billObject, facilityObject.paymentDistribution);
        await context.app.service('billings').patch(updatedBill._id, updatedBill, {});
      }
    }
  }
}


function sumBillItems(bill, facilityDeductionPlan) {
  let totalCost = 0;
  let totalCostValue = 0;
  bill.billItems.map(element => {
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

  bill.grandTotal = totalCost;
  bill.subTotal = totalCost;
  bill.totalCost = totalCostValue;

  return bill;
}



module.exports = {
  before: {
    all: [authenticate('jwt'), softDelete()],
    find: [extractbill(), iscovered()],
    get: [iscovered()],
    create: [],
    update: [],
    patch: [iscovered(), fastJoin(fixedEditPrice)],
    remove: []
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [extractbill()],
    get: [],
    create: [],
    update: [],
    patch: [fastJoin(fixedEditPrice)],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
