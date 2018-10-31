const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        patientDetails: () => async(prescription, context) => {
            const personDetails = await context.app.service('patients').get(prescription.patientId, {});
            prescription.personDetails = personDetails.personDetails;
        },
        employeeDetails: () => async(prescription, context) => {
            const employee = await context.app.service('employees').get(prescription.employeeId, {});
            prescription.employeeDetails = employee.personDetails;
        }
    }
};

const billing = {
    joins: {
        isBilled: () => async(prescription, context) => {
            if (prescription.prescriptionItems.length > 0) {
                for (let i = 0; i < prescription.prescriptionItems.length; i++) {
                    const prescribe = prescription.prescriptionItems[i];
                    if (prescribe.billId && prescription.billItemId) {
                        const billing = await context.app.service('billings').get(prescribe.billId, {});

                        if (billing._id) {
                            billing.billItems.forEach(i => {
                                if (i._id === prescribe.billItemId) {
                                    prescribe.paymentCompleted = i.paymentCompleted;
                                }
                            });
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    before: {
        all: [authenticate('jwt')],
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
        get: [fastJoin(billing)],
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
