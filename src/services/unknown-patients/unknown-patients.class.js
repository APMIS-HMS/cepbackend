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

  async update(id, data, params) {
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
    const verifiedPerson = await personService.get(params.query.verifiedPersonId, {});
    verifiedPerson.wallet.balance += unknownPerson.wallet.balance;

    //write code to soft delete unknown person here
    await personService.remove(unknownPerson._id,{});

    const unknownPatient = await patientService.get(id, {});
    const verifiedPatient = await personService.get(params.query.verifiedPatientId, {});
    verifiedPatient.tags = (verifiedPatient.tags !== undefined) ? verifiedPatient.tags : [];
    unknownPatient.tags = (unknownPatient.tags !== undefined) ? unknownPatient.tags : [];
    verifiedPatient.tags.push(...unknownPatient.tags);
    verifiedPatient.clientsNo = (verifiedPatient.clientsNo !== undefined) ? verifiedPatient.clientsNo : [];
    unknownPatient.clientsNo = (unknownPatient.clientsNo !== undefined) ? unknownPatient.clientsNo : [];
    verifiedPatient.clientsNo.push(...unknownPatient.clientsNo);
    verifiedPatient.timeLines = (verifiedPatient.timeLines !== undefined) ? verifiedPatient.timeLines : [];
    unknownPatient.timeLines = (unknownPatient.timeLines !== undefined) ? unknownPatient.timeLines : [];
    verifiedPatient.timeLines = verifiedPatient.timeLines.push(...unknownPatient.timeLines);
    verifiedPerson.wallet.balance += unknownPerson.wallet.balance;


    //write code to soft delete unknown patient here
    await patientService.remove(unknownPatient._id,{});



    const unknownBills = await billingService.find({
      query: {
        patientId: id
      }
    });

    unknownBills.data.map(element => {
      if (element.coverFile === undefined) {
        element.patientId = params.query.verifiedPatientId;
      }
      element.billItems.map(element3 => {
        element3.patientId = params.query.verifiedPatientId
      });
    });

    await billService.create(unknownBills.data);

    for (let index = 0; index < unknownBills.data.length; index++) {
      const element = unknownBills.data[index];
      await billService.remove(element._id,{});
    }

    const unknownPrescriptions = await prescriptionService.find({
      query: {
        patientId: id
      }
    });

    unknownPrescriptions.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
    });

    await prescriptionService.create(unknownPrescriptions.data);

    for (let index = 0; index < unknownPrescriptions.data.length; index++) {
      const element = unknownPrescriptions.data[index];
      await prescriptionService.remove(element._id,{});
    }

    const unknownLabRequest = await labReqService.find({
      query: {
        patientId: id
      }
    });

    unknownLabRequest.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
    });

    await labReqService.create(unknownLabRequest.data);

    for (let index = 0; index < unknownLabRequest.data.length; index++) {
      const element = unknownLabRequest.data[index];
      await labReqService.remove(element._id,{});
    }

    const unknownTreatment = await treatmentService.find({
      query: {
        facilityId: params.query.facilityId,
        personId: params.query.unknownPersonId
      }
    });

    unknownTreatment.data.map(element => {
      element.personId = params.query.verifiedPersonId;
    });
    if (unknownTreatment.data.length > 0) {
      await treatmentService.create(unknownTreatment.data);
    }

    for (let index = 0; index < unknownTreatment.data.length; index++) {
      const element = unknownTreatment.data[index];
      await treatmentService.remove(element._id,{});
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
    }
    verifiedDoc.data[0].documentations.push(...unknownDoc.data[0].documentations);

    if (verifiedDoc.data.length > 0) {
      await treatmentService.patch(verifiedDoc.data[0]._id, {
        documentations: verifiedDoc.data[0].documentations
      });
    }

    for (let index = 0; index < unknownTreatment.data.length; index++) {
      const element = unknownTreatment.data[index];
      await treatmentService.remove(element._id,{});
    }

    const unknownAppointments = await appointmentService.find({
      query: {
        patientId: id
      }
    });

    unknownAppointments.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
    });

    if (unknownAppointments.data.length > 0) {
      await appointmentService.create(unknownAppointments.data);
    }
    for (let index = 0; index < unknownAppointments.data.length; index++) {
      const element = unknownAppointments.data[index];
      await appointmentService.remove(element._id,{});
    }

    const unknowInPatients = await inPatientsService.fin({
      query: {
        patientId: id
      }
    });

    unknowInPatients.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
    });

    if (unknowInPatients.data.length > 0) {
      await inPatientsService.create(unknowInPatients.data);
    }
    for (let index = 0; index < unknowInPatients.data.length; index++) {
      const element = unknowInPatients.data[index];
      await inPatientsService.remove(element._id,{});
    }

    const unknowInPatientWaiting = await inPatientWatingService.fin({
      query: {
        patientId: id
      }
    });

    unknowInPatientWaiting.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
    });

    if (unknowInPatientWaiting.data.length > 0) {
      await inPatientWatingService.create(unknowInPatientWaiting.data);
    }
    for (let index = 0; index < unknowInPatientWaiting.data.length; index++) {
      const element = unknowInPatientWaiting.data[index];
      await inPatientWatingService.remove(element._id,{});
    }

    const unknowInvoice = await invoiceService.fin({
      query: {
        patientId: id
      }
    });

    unknowInvoice.data.map(element => {
      element.patientId = params.query.verifiedPatientId;
      element.billingIds.map(element_ => {
        element_.patientId = params.query.verifiedPatientId;
      });
    });

    if (unknowInvoice.data.length > 0) {
      await invoiceService.create(unknowInvoice.data);
    }
    for (let index = 0; index < unknowInvoice.data.length; index++) {
      const element = unknowInvoice.data[index];
      await invoiceService.remove(element._id,{});
    }
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
