/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    const makePaymentService = this.app.service('make-payments');
    const patientService = this.app.service('patients');
    const personService = this.app.service('peoples');
    const billCreatorService = this.app.service('bill-creators');
    const familyService = this.app.service('families');

    let patientItem = {
      personId: data.personId,
      facilityId: data.facilityId,
      paymentPlan: [{
        planType: "wallet",
        bearerPersonId: data.personId,
        isDefault: true,
      }]
    };
    if (data.coverType === 'insurance') {
      patientItem.paymentPlan[0].isDefault = false;
      patientItem.paymentPlan.push({
        planType: data.coverType,
        isDefault: true,
        planDetails: {
          hmoId: data.cover.id,
          hmoName: data.cover.name,
          principalId: data.cover.fileNo
        }
      });
      console.log('***********************************Payment Plan*************************************');
      console.log(patientItem.paymentPlan);
      console.log('***********************************Payment Plan End*************************************');
    } else if (data.coverType === 'family') {
      patientItem.paymentPlan[0].isDefault = false;
      const poliyFile = await familyService.find({
        query: {
          'familyCovers.filNo': data.cover.fileNo
        }
      });
      console.log('***********************************poliyFile*************************************');
      console.log(poliyFile);
      console.log('***********************************poliyFile End*************************************');
      const bearerPrincipalPatient = poliyFile.data[0].familyCovers.find(x => x.filNo.toString() === data.cover.fileNo.toString());
      const bearerBeneficiaryPatient = poliyFile.data[0].familyCovers.find(x => x.filNo.toString() === data.cover.clientNo.toString());
      if (bearerPrincipalPatient.patientId !== undefined) {
        const principalPatient = await patientService.get(bearerPatient.patientId);
        if (data.cover.filNo.toString() !== data.cover.clientNo.toString()) {
          patientItem.paymentPlan.push({
            planType: data.coverType,
            bearerPersonId: principalPatient.personId,
            planDetails: {
              principalId: data.cover.fileNo,
              principalName: bearerPatient.othernames + ' ' + bearerPatient.surname,
              familyId: poliyFile.data[0]._id
            },
            isDefault: true
          });
        }
      }
    } else {
      if (data.cover.filNo.toString() === data.cover.clientNo.toString()) {
        patientItem.paymentPlan.push({
          planType: data.coverType,
          bearerPersonId: data.personId,
          planDetails: {
            principalId: data.cover.fileNo,
            principalName: bearerPatient.othernames + ' ' + bearerPatient.surname,
            familyId: poliyFile.data[0]._id
          },
          isDefault: true
        });
      } else {
        const result = {
          coverType: data.coverType,
          message: 'can not find principal patient'
        };
        return jsend.error(result)
      }
    }
    const addedPatient = await patientService.create(patientItem);
    if (bearerPrincipalPatient.patientId !== undefined) {
      poliyFile.data[0].familyCovers.forEach(element => {
        if (element.clientNo.toString() === data.cover.clientNo.toString()) {
          element.patientId = addedPatient._id;
        }
      });
      await familyService.patch(poliyFile.data[0]._id, {
        familyCovers: poliyFile.data[0].familyCovers
      }, {});
    } else {
      poliyFile.data[0].familyCovers.forEach(element => {
        if (element.filNo.toString() === data.cover.fileNo.toString()) {
          element.patientId = addedPatient._id;
        }
      });
      await familyService.patch(poliyFile.data[0]._id, {
        familyCovers: poliyFile.data[0].familyCovers
      }, {});
    }
    console.log('***********************************Patient Plan*************************************');
    console.log(addedPatient.paymentPlan);
    console.log('***********************************Patient Plan End*************************************');
    const billItem = [{
      unitPrice: data.cost,
      facilityId: data.facilityId,
      facilityServiceId: data.facilityServiceId,
      serviceId: data.serviceId,
      patientId: addedPatient._id,
      quantity: 1,
      active: true,
      totalPrice: data.cost,
      covered: {
        hmoId: (data.coverType === 'insurance') ? data.cover.id : '',
        familyId: (data.coverType === 'family') ? poliyFile.data[0]._id : '',
        coverType: data.coverType
      }
    }];
    console.log('***********************************Bill*************************************');
    console.log(billItem[0]);
    console.log('***********************************Bill End*************************************');
    const _createdBill = await billCreatorService.create(
      billItem, {
        query: {
          facilityId: data.facilityId,
          patientId: addedPatient._id
        }
      });
    let createdBill = _createdBill[0];
    console.log(createdBill);
    createdBill.billItems[0].facilityServiceObject = {
      categoryId: data.categoryId,
      category: data.category,
      service: data.service,
      serviceId: data.serviceId
    };
    if (data.coverType === 'wallet') {
      let makePaymentItem = {
        inputedValue: {
          paymentMethod: addedPatient.paymentPlan.find(x => x.isDefault === true),
          amountPaid: data.amountPaid,
          balance: (data.cost - data.amountPaid),
          cost: data.cost,
          isWaved: false,
          transactionType: "Dr",
          paymentTxn: [{
            paymentDate: Date.now(),
            date: Date.now(),
            qty: 1,
            billModelId: createdBill._id,
            billObjectId: createdBill.billItems[0]._id,
            facilityServiceObject: {
              categoryId: data.categoryId,
              category: data.category,
              service: data.service,
              serviceId: data.serviceId
            },
            amountPaid: data.amountPaid,
            totalPrice: data.cost,
            isSubCharge: false,
            balance: (data.cost - data.amountPaid),
            isPaymentCompleted: (data.cost - data.amountPaid === 0) ? true : false,
            isWaiver: false,
            isItemTxnClosed: true,
            waiverComment: ""
          }]
        },
        billGroups: [{
          isChecked: true,
          total: data.cost,
          isOpened: true,
          categoryId: data.categoryId,
          category: data.category,
          bills: [{
            amount: data.cost,
            itemDesc: "",
            itemName: data.category,
            qty: 1,
            covered: {
              coverType: data.coverType
            },
            unitPrice: data.cost,
            _id: createdBill.billItems[0]._id,
            facilityServiceObject: {
              categoryId: data.categoryId,
              category: data.category,
              service: data.service,
              serviceId: data.serviceId
            },

            billObject: createdBill.billItems[0],
            billModelId: createdBill._id,
            isChecked: true
          }]
        }],
        patientId: addedPatient._id,
        personId: data.personId,
        facilityId: data.facilityId,
        discount: 0,
        subTotal: data.cost,
        checkBillitems: [createdBill.billItems[0]._id],
        listedBillItems: [createdBill],
        isInvoicePage: false,
        transactionStatus: "Complete"
      }
      const paidItems = await makePaymentService.create(makePaymentItem);
      if (paidItems !== null && paidItems !== undefined) {
        const result = {
          coverType: data.coverType
        }
        return jsend.success(result);
      } else {
        const result = {
          coverType: data.coverType
        }
        return jsend.error(result);
      }
    } else if (data.coverType === 'insurance' || data.coverType === 'family') {
      const result = {
        coverType: data.coverType
      };
      if (createdBill !== null && createdBill !== undefined) {
        return jsend.success(result);
      } else {
        return jsend.error(result);
      }
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
