const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        recordObject: () => async(data, context) => {
            if (!data.immunizations) return;
            if (data.immunizations.length > 0) {
                for (let i = 0; i < data.immunizations.length; i++) {
                    const record = data.immunizations[i];
                    if (!record.administeredBy) continue;
                    const employee = await context.app.service('employees').get(record.administeredBy);
                    const fullName = `${employee.personDetails.firstName} ${employee.personDetails.lastName}`;
                    record.administeredByFullName = fullName;
                }
            } else return;
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
        all: [],
        find: [fastJoin(resolvers)],
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