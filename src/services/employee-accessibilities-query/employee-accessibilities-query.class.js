/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    console.log(1);
    // const employeeService = this.app.service('employees');
    // const peopleService = this.app.service('people');
    const facilityAccessibilityService = this.app.service('facility-access-control');
    const userService = this.app.service('users');
    const featureService = this.app.service('features');

    if (params.query.isEmployeeInRoles) {
      let users, features, access;

      // get users roles
      try {
        users = await userService.find({
          query: {
            personId: params.query.personId,
            'userRoles.facilityId': params.query.facilityId,
            $select: {
              'userRoles.$': 1
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
      console.log(2);
      // get validation roles
      try {
        features = await featureService.find({
          query: {
            name: params.query.moduleName,
            'actions.name': params.query.roleName,
            $select: {
              'actions.$': 1
            }
          }
        });
      } catch (error) {
        console.log(error);
      }


      let roleFeatures = features.data.map(record => record.actions.map(action => action._id.toString()));
      roleFeatures = [].concat.apply(...(roleFeatures || []));
      console.log(5);
      // check for roleName in facilityaccesscontrols
      if (roleFeatures.length > 0) {
        try {
          access = await facilityAccessibilityService.find({
            query: {
              facilityId: params.query.facilityId,
              'features._id': {
                $in: roleFeatures
              },
              $select: {
                'features.$': 1
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (users.data.length > 0) {
        let items = users.data[0].userRoles[0].roles;
        items = items.map(item => item.toString());
        var uniqueItems = [...new Set(items)];
        const userHasRole = uniqueItems.some(v => access.data.map(acc => acc._id.toString()).indexOf(v) !== -1);
        return userHasRole;
        // return Promise.resolve({
        //   features,
        //   uniqueItems,
        //   access
        // });
      }
    }









    // return Promise.resolve(users);
    // console.log(users);



  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
