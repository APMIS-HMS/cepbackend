/* eslint-disable no-unused-vars */
const jsend = require('jsend');

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
    const personService = this.app.service('people');
    const patientService = this.app.service('patients');
    const billingService = this.app.service('bill-creators');

    const person = {
      title: 'Unknown',
      firstName: 'Unknown',
      lastName: 'Unknown',
      gender: (data.gender === null || data.gender === undefined) ? 'Not Identified' : data.gender,
      motherMaidenName: 'Unknown',
      primaryContactPhoneNo: ' '
    };

    const savedPerson = await personService.create(person);
    await personService.patch(savedPerson._id, {
      firstName: savedPerson.apmisId,
      lastName: savedPerson.apmisId
    });

    const patient = {
      personId: savedPerson._id,
      facilityId: data.facilityId,
      isActive: true,
      isUnknown: true,
      paymentPlan: [{
        planDetails: false,
        isDefault: true,
        bearerPersonId: savedPerson._id,
        planType: 'wallet'
      }],
      tags: [data.tag]
    };
    const savedPatient = await patientService.create(patient);
    const billing = [{
      unitPrice: data.unitPrice,
      facilityId: data.facilityId,
      description: '',
      facilityServiceId: data.facilityServiceId,
      serviceId: data.planId,
      patientId: savedPatient._id,
      quantity: 1,
      totalPrice: data.unitPrice,
      unitDiscountedAmount: 0,
      totalDiscoutedAmount: 0,
      modifierId: [],
      covered: {
        coverType: data.coverType
      },
      isServiceEnjoyed: false,
      paymentCompleted: false,
      paymentStatus: [],
      payments: []

    }];

    await billingService.create(billing, {
      query: {
        facilityId: data.facilityId,
        patientId: savedPatient._id
      }
    });

    return savedPatient;
  }

  update(id, data, params) {
    return Promise.resolve([]);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  async remove(id, params) {
    const personService = this.app.service('people');
    const patientService = this.app.service('patients');
    const billService = this.app.service('billings');
    const prescriptionService = this.app.service('prescriptions');
    const labReqService = this.app.service('laboratory-requests');
    const treatmentService = this.app.service('treatment-sheets');
    const docService = this.app.service('documentations');
    const appointmentService = this.app.service('appointments');
    const inPatientsService = this.app.service('in-patients');
    const inPatientWatingService = this.app.service('inpatient-waiting-lists');
    const invoiceService = this.app.service('invoices')
    const unknownPerson = await personService.get(params.query.unknownPersonId, {});
    const unknownPersonWallet = await personService.get(params.query.unknownPersonId, {
      query: {
        $select: ['wallet']
      }
    });
    const verifiedPerson = await personService.get(params.query.verifiedPersonId, {});
    const verifiedPersonWallet = await personService.get(params.query.verifiedPersonId, {
      query: {
        $select: ['wallet']
      }
    });
    verifiedPerson.wallet = (verifiedPersonWallet.wallet !== undefined) ? verifiedPersonWallet.wallet : {};
    unknownPerson.wallet = (unknownPersonWallet.wallet !== undefined) ? unknownPersonWallet.wallet : {};
    verifiedPerson.wallet.balance = (isNaN(verifiedPerson.wallet.balance)) ? 0 : verifiedPerson.wallet.balance;
    unknownPerson.wallet.balance = (isNaN(unknownPerson.wallet.balance)) ? 0 : unknownPerson.wallet.balance;
    verifiedPerson.wallet.ledgerBalance = (isNaN(verifiedPerson.wallet.ledgerBalance)) ? 0 : verifiedPerson.wallet.ledgerBalance;
    unknownPerson.wallet.ledgerBalance = (isNaN(unknownPerson.wallet.ledgerBalance)) ? 0 : unknownPerson.wallet.ledgerBalance;
    verifiedPerson.wallet.balance += unknownPerson.wallet.balance;
    verifiedPerson.wallet.ledgerBalance += unknownPerson.wallet.ledgerBalance;
    unknownPerson.wallet.transactions = (unknownPerson.wallet.transactions !== undefined) ? unknownPerson.wallet.transactions : [];
    verifiedPerson.wallet.transactions = (verifiedPerson.wallet.transactions !== undefined) ? verifiedPerson.wallet.transactions : [];
    verifiedPerson.wallet.transactions.push(...unknownPerson.wallet.transactions);
    personService.patch(verifiedPerson._id, {
      wallet: verifiedPerson.wallet
    }, {}).then(p=>{
    },e=>{
    });
    const unknownPatient = await patientService.get(id, {});
    const verifiedPatient = await patientService.get(params.query.verifiedPatientId, {});
    verifiedPatient.tags = (verifiedPatient.tags !== undefined) ? verifiedPatient.tags : [];
    unknownPatient.tags = (unknownPatient.tags !== undefined) ? unknownPatient.tags : [];
    verifiedPatient.tags.push(...unknownPatient.tags);
    verifiedPatient.clientsNo = (verifiedPatient.clientsNo !== undefined) ? verifiedPatient.clientsNo : [];
    unknownPatient.clientsNo = (unknownPatient.clientsNo !== undefined) ? unknownPatient.clientsNo : [];
    verifiedPatient.clientsNo.push(...unknownPatient.clientsNo);
    verifiedPatient.timeLines = (verifiedPatient.timeLines !== undefined) ? verifiedPatient.timeLines : [];
    unknownPatient.timeLines = (unknownPatient.timeLines !== undefined) ? unknownPatient.timeLines : [];
    verifiedPatient.timeLines = verifiedPatient.timeLines.push(...unknownPatient.timeLines);
    //write code to soft delete unknown patient here
    const awaitedPaitent = await patientService.patch(verifiedPatient._id, verifiedPatient, {});
    const unknownBills = await billService.find({
      query: {
        patientId: id
      }
    });
    const _unknownBills = JSON.parse(JSON.stringify(unknownBills));
    _unknownBills.data.map(element => {
      delete element._id;
      if (element.coverFile === undefined) {
        element.patientId = params.query.verifiedPatientId;
      }
      element.billItems.map(element3 => {
        element3.patientId = params.query.verifiedPatientId
      });
    });
    billService.create(_unknownBills.data).then(payload => {
    }, err => {
    });

    const unknownPrescriptions = await prescriptionService.find({
      query: {
        patientId: id
      }
    });
    const _unknownPrescriptions = JSON.parse(JSON.stringify(unknownPrescriptions));
    _unknownPrescriptions.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
    });
    if (_unknownPrescriptions.data.length > 0) {
      prescriptionService.create(_unknownPrescriptions.data).then(payload => {
      }, err => {
      })
    }
    const unknownLabRequest = await labReqService.find({
      query: {
        patientId: id
      }
    });
    const _unknownLabRequest = JSON.parse(JSON.stringify(unknownLabRequest));
    _unknownLabRequest.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
    });
    if (_unknownLabRequest.data.length > 0) {
      await labReqService.create(_unknownLabRequest.data);
    }
    const unknownTreatment = await treatmentService.find({
      query: {
        facilityId: params.query.facilityId,
        personId: params.query.unknownPersonId
      }
    });
    const _unknownTreatment = JSON.parse(JSON.stringify(unknownTreatment));
    _unknownTreatment.data.map(element => {
      delete element._id;
      element.personId = params.query.verifiedPersonId;
    });
    if (_unknownTreatment.data.length > 0) {
      await treatmentService.create(_unknownTreatment.data);
    }

    const unknownDoc = await docService.find({
      query: {
        personId: params.query.unknownPersonId
      }
    });
    const verifiedDoc = await docService.find({
      query: {
        personId: params.query.verifiedPersonId
      }
    });
    if (unknownDoc.data.length > 0) {
      unknownDoc.data[0].personId = params.query.verifiedPersonId;
      unknownDoc.data[0].documentations.map(element => {
        element.patientId = params.query.verifiedPatientId;
      });
      verifiedDoc.data[0].documentations.push(...unknownDoc.data[0].documentations);
    }
    
    if (verifiedDoc.data.length > 0) {
      docService.patch(verifiedDoc.data[0]._id, {
        documentations: verifiedDoc.data[0].documentations
      }).then(payload => {
      }, err => {
      })
    }
    const unknownAppointments = await appointmentService.find({
      query: {
        patientId: id
      }
    });
    const _unknownAppointments = JSON.parse(JSON.stringify(unknownAppointments));
    _unknownAppointments.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
    });

    if (_unknownAppointments.data.length > 0) {
      await appointmentService.create(_unknownAppointments.data);
    }

    const unknowInPatients = await inPatientsService.find({
      query: {
        patientId: id
      }
    });
    const _unknowInPatients = JSON.parse(JSON.stringify(unknowInPatients));
    _unknowInPatients.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
    });

    if (unknowInPatients.data.length > 0) {
      await inPatientsService.create(_unknowInPatients.data);
    }

    const unknowInPatientWaiting = await inPatientWatingService.find({
      query: {
        patientId: id
      }
    });
    const _unknowInPatientWaiting = JSON.parse(JSON.stringify(unknowInPatientWaiting));

    _unknowInPatientWaiting.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
    });

    if (_unknowInPatientWaiting.data.length > 0) {
      await inPatientWatingService.create(_unknowInPatientWaiting.data);
    }

    const unknowInvoice = await invoiceService.find({
      query: {
        patientId: id
      }
    });
    const _unknowInvoice = JSON.parse(JSON.stringify(unknowInvoice));
    _unknowInvoice.data.map(element => {
      delete element._id;
      element.patientId = params.query.verifiedPatientId;
      element.billingIds.map(element_ => {
        element_.patientId = params.query.verifiedPatientId;
      });
    });
    if (_unknowInvoice.data.length > 0) {
      await invoiceService.create(_unknowInvoice.data);
    }
    
    //Deleting the existing data
    for (let index = 0; index < unknownTreatment.data.length; index++) {
      const element = unknownTreatment.data[index];
       treatmentService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknownAppointments.data.length; index++) {
      const element = unknownAppointments.data[index];
       appointmentService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknowInPatients.data.length; index++) {
      const element = unknowInPatients.data[index];
       inPatientsService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknowInPatientWaiting.data.length; index++) {
      const element = unknowInPatientWaiting.data[index];
       inPatientWatingService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknowInvoice.data.length; index++) {
      const element = unknowInvoice.data[index];
       invoiceService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknownPrescriptions.data.length; index++) {
      const element = unknownPrescriptions.data[index];
       prescriptionService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknownLabRequest.data.length; index++) {
      const element = unknownLabRequest.data[index];
       labReqService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknownDoc.data.length; index++) {
      const element = unknownDoc.data[index];
      docService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    for (let index = 0; index < unknownBills.data.length; index++) {
      const element = unknownBills.data[index];
      billService.remove(element._id, {}).then(pay => {
      }, err => {
      })
    }
    patientService.remove(unknownPatient._id, {}).then(pay => {
    }, err => {
    });

    personService.remove(unknownPerson._id, {}).then(pay => {
    }, err => {
    }); 
    return jsend.success(verifiedPatient);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
