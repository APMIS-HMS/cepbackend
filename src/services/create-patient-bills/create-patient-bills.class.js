/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async create(data, params) {
    // console.log('*************************************DATA***********************************');
    // console.log(data);
    // console.log('*************************************DATA END***********************************');
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
    } else if (data.coverType === 'family') {
      patientItem.paymentPlan[0].isDefault = false;
      const poliyFile = await familyService.find({
        query: {
          'familyCovers.filNo': data.cover.fileNo
        }
      });
      const bearerPatient = poliyFile.data[0].familyCovers.find(x => x.serial === 0);
      const bearerPersonId = await personService.get(bearerPatient);
      patientItem.paymentPlan.push({
        planType: data.coverType,
        bearerPersonId: bearerPersonId._id,
        planDetails: {
          principalId: bearerPatient.filNo,
          principalName: bearerPersonId.firstName + ' ' + bearerPersonId.lastName,
          familyId: poliyFile.data[0]._id
        },
        isDefault: true
      });
    }
    console.log(1);
    const addedPatient = await patientService.create(patientItem);
    console.log(2);
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
        coverType: data.coverType
      }
    }];
    console.log(3);
    const _createdBill = await billCreatorService.create(
      billItem, {
        query: {
          facilityId: data.facilityId,
          patientId: addedPatient._id
        }
      });
    let createdBill = _createdBill[0];
    console.log(4);
    createdBill.billItems[0].facilityServiceObject = {
      categoryId: data.categoryId,
      category: data.category,
      service: data.service,
      serviceId: data.serviceId
    };
    console.log(data.coverType);
    if (data.coverType === 'wallet') {
      console.log(data.coverType);
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
      return paidItems;
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
