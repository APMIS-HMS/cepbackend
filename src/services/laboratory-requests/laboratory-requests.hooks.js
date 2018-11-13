const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin,softDelete2 } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        patientDetails: () => async(request, context) => {
            const patient = await context.app.service('patients').get(request.patientId, {});
            request.personDetails = patient.personDetails;
        },
        employeeDetails: () => async(request, context) => {
            const employee = await context.app.service('employees').get(request.createdBy, {});
            request.employeeDetails = employee.personDetails;
        }
    }
};


module.exports = {
    before: {
        all: [authenticate('jwt'),softDelete2()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [softDelete2(),fastJoin(resolvers)],
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