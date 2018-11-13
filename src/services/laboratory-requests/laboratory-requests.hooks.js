const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin,softDelete } = require('feathers-hooks-common');
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
        all: [authenticate('jwt'),softDelete()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [softDelete(),fastJoin(resolvers)],
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