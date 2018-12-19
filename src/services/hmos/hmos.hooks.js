const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const prop = require('../../hooks/context-prop.hook');


const fastJoinFacilityName = {
  joins: {
    facilityObj: () => async (data, context) => {
      if (context.type === 'before') {
        if (context.params.query.setName !== undefined) {
          delete context.params.query.setName;
          context.params.setName = true;
        }
      } else if (context.type === 'after') {
        if (context.params.setName !== undefined) {
          for (let index = 0; index < data.hmos.length; index++) {
            const element = data.hmos[index];
            const facilityName = await context.app.service('facilities').get(element.hmo, {});
            data.hmos[index].hmoName = facilityName.name;
            delete context.params.setName;
          }
        }
      }
    }
  }
}




module.exports = {
  before: {
    all: [],//authenticate('jwt')],
    find: [prop()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [fastJoin(fastJoinFacilityName)],
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
