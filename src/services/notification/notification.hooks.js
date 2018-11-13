const { authenticate } = require('@feathersjs/authentication').hooks;
const {
    fastJoin
} = require('feathers-hooks-common');

const resolvers = {
    joins: {
        loggedInUser: () => async (notification, context) => {
            console.log('========hook context=========\n',context);
            notification.senderId = context.user._id ;
            notification.isRead = false ;

        }
    }

};



module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [fastJoin(resolvers)],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
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
