const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin,
  softDelete
} = require('feathers-hooks-common');
var startOfDay = require('date-fns/start_of_day');
var endOfDay = require('date-fns/end_of_today');
var isToday = require('date-fns/is_today');
const sms = require('../../templates/sms-sender');
const emailer = require('../../templates/emailer');
const resolvers = {
  joins: {
    patientDetails: () => async (appointment, context) => {
      const patient =
        await context.app.service('patients').get(appointment.patientId, {});
      appointment.patientDetails = patient;
      if (context.method === 'create' && process.env.SENDSMS === 'true') {
        await sms.sendScheduleAppointment(new Date(), appointment);
      }
      if (context.method === 'create' || context.method === 'update' || context.method === 'patch') {
        await emailer.appointment(appointment);
      }
    },
    providerDetails: () => async (appointment, context) => {
      if (appointment.doctorId !== undefined) {
        const employee = await context.app.service('employees')
          .get(appointment.doctorId, {});
        appointment.providerDetails = employee;
      }
    },
    immunizationRecords: () => async (appointment, context) => {
      const recordResult =
        await context.app.service('immunization-records').find({
          query: {
            'patientId': appointment.patientId
          }
        });
      if (recordResult.data.length > 0) {
        const records = recordResult.data[0].immunizations.filter(
          rec => {
            return rec.appointmentId.toString() ==
              appointment._id.toString();
          });
        appointment.immunizationRecords = records;
      }
    },

    checkVitals: () => async (appointment, context) => {
      let vitals = [];
      appointment.hasDoneVital = false;
      const start = startOfDay(new Date());
      const end = endOfDay(new Date());
      const patientDocumentations =
        await context.app.service('documentations').find({
          query: {
            'documentations.patientId': appointment.patientId,
            'documentations.document.body.vitals.updatedAt': {
              '$gte': start,
              '$lt': end
            },
            $select: {
              'documentations.document.body.vitals.$': 1
            }
          }
        });
      if (patientDocumentations.data.length > 0) {
        vitals = [];
        let patientDocumentation = patientDocumentations.data[0];

        let l = patientDocumentation.documentations.length;
        while (l--) {
          const documentation = patientDocumentation.documentations[l];
          if (documentation.document.documentType !== undefined &&
            documentation.document.documentType.title === 'Vitals') {
            //
            let m = documentation.document.body.vitals.length;
            while (m--) {
              const vital = documentation.document.body.vitals[m];
              if (isToday(vital.updatedAt)) {
                vitals.push(vital);
                appointment.hasDoneVital = true;
              }
            }
          }
        }



        // patientDocumentation.documentations.forEach(documentation => {
        //     if (
        //         documentation.document.documentType !== undefined &&
        //         documentation.document.documentType.title === 'Vitals'
        //     ) {
        //         documentation.document.body.vitals.forEach(vital => {
        //             vitals.push(vital);
        //         });
        //     }
        // });

        // console.log(vitals);
      }
    },
    notification: () => async (appointment, context) => {
      appointment = {
        facilityId: appointment.facilityId,
        title: 'New Appointment Schedule',
        description: 'An appointment has be schedule for you. Click to view details',
        receiverId: appointment.doctorId,
        senderId: appointment.employee
      };
      if (context.method === 'create') {
        context.app.service('notification').create(appointment, {}).then(payload => {}, err => {});
      }

    },

    // getVitals() {
    //     this.vitals = [];
    //     this.patientDocumentation.documentations.forEach(documentation => {
    //         if (
    //             documentation.document.documentType !== undefined &&
    //             documentation.document.documentType.title === 'Vitals'
    //         ) {
    //             documentation.document.body.vitals.forEach(vital => {
    //                 this.vitals.push(vital);
    //             });
    //         }
    //     });
    //     console.log(this.vitals);
    // }
  }
};
module.exports = {
  before: {
    all: [authenticate('jwt'), softDelete()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
