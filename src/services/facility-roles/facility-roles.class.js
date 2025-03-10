/* eslint-disable no-unused-vars */
const logger = require('winston');
const jsend = require('jsend');
const BatchLoader = require('@feathers-plus/batch-loader');
const {
  getResultsByKey,
  getUniqueKeys
} = BatchLoader;
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const facilityId = params.query.facilityId;
    const facilityAccessControlService = this.app.service(
      'facility-access-control'
    );
    const facilityService = this.app.service('facilities');
    const selectedFacility = await facilityService.get(facilityId, {});
    let userRoles = [];
    userRoles = userRoles.concat
      .apply([], params.user.userRoles.filter(u => u.facilityId == facilityId))
      .map(x => x.roles);
    userRoles = [].concat.apply([], userRoles);
    let features = await facilityAccessControlService.find({
      query: {
        facilityId: facilityId,
        _id: {
          $in: getUniqueKeys(userRoles)
        },
        $limit: 200
      }
    }).catch(err => {
      // console.log(err.params.query);
    });
    let outArray = [];
    outArray = outArray.concat(features.data.map(x => x.features));
    var merged = [].concat.apply([], outArray);
    const distinctModules = await this.getDistinctModules(merged);
    return {
      features: merged,
      modules: distinctModules,
      selectedFacility: selectedFacility
    };

  }

  async getDistinctModules(list) {
    const dat = list.map(x => x.moduleId);
    const result = Array.from(new Set(dat));
    const facilityModuleService = this.app.service('facility-modules');
    try {
      const modules = await facilityModuleService.find({
        query: {
          _id: {
            $in: [...new Set(result)]
          },
          $limit: 25
        }
      });
      return modules.data;
    } catch (error) {
      return error;
    }


  }

  async get(id, params) {
    const usersService = this.app.service('users');
    const facilityAccessControlService = this.app.service(
      'facility-access-control'
    );
    var results = [];
    var errors = [];

    let selectedUser = await usersService.find({
      query: {
        personId: id
      }
    });
    let features = await facilityAccessControlService.find({
      query: {
        facilityId: params.query.facilityId,
        $limit: 200
      }
    });
    if (selectedUser.data.length == 0) {
      results = [];
    } else {
      if (selectedUser.data[0].userRoles === undefined) {
        selectedUser.data[0].userRoles = [];
      }
      if (selectedUser.data[0].userRoles) {
        let index = selectedUser.data[0].userRoles.filter(
          x => x.facilityId.toString() == params.query.facilityId.toString()
        );
        if (index[0] !== undefined && index[0].roles.length > 0) {
          features.data.forEach((feature, i) => {
            if (
              index[0].roles.filter(
                x => x.toString() === feature._id.toString()
              ).length > 0
            ) {
              feature.isAssigned = true;
              results.push(feature);
            } else {
              feature.isAssigned = false;
              results.push(feature);
            }
          });
        } else {
          results = features.data;
        }
      }
    }

    return jsend.success(features.data);
  }

  async create(data, params) {
    const usersService = this.app.service('users');
    let selectedUser = await usersService.find({
      query: {
        personId: data.personId
      }
    });

    if (selectedUser.data[0].userRoles === undefined) {
      selectedUser.data[0].userRoles = [];
    }

    let index = selectedUser.data[0].userRoles.findIndex(
      x => x.facilityId.toString() == data.facilityId.toString()
    );

    // selectedUser.data[0]. [index].roles.forEach(ind => {
    //   data.roles.forEach(indx => {
    //     if (ind != indx) {
    //       selectedUser.data[0].userRoles[index].roles.push(indx);
    //     }
    //   });
    // });
    const roleCount = selectedUser.data[0].userRoles.length;
    data.roles.forEach((indx, i) => {
      if (index > -1) {
        let roleFil = selectedUser.data[0].userRoles[index].roles.filter(m => m === indx);
        if (roleFil.length === 0) {
          selectedUser.data[0].userRoles[index].roles.push(indx);
        }
        /* selectedUser.data[0].userRoles[index].roles.forEach(ind => {
            console.log(ind)
            if (ind != indx) {

            }
        }); */
      } else {
        if (selectedUser.data[0].userRoles.length === 0) {
          let userRole = {
            facilityId: data.facilityId,
            roles: []
          };
          userRole.roles.push(indx);
          selectedUser.data[0].userRoles.push(userRole);
        } else {
          // selectedUser.data[0].userRoles[0].roles.push(indx);
          if (i === 0) {
            let userRole = {
              facilityId: data.facilityId,
              roles: []
            };
            userRole.roles.push(indx);
            selectedUser.data[0].userRoles.push(userRole);
          } else {
            selectedUser.data[0].userRoles[roleCount].roles.push(indx);
          }
        }
      }
    });

    if (data.rolesRemoved.length > 0) {
      const roles = selectedUser.data[0].userRoles[index].roles;
      var l = data.rolesRemoved.length;
      while (l--) {
        const role = data.rolesRemoved[l];
        selectedUser = this.removeRole(selectedUser, role, index);
      }
    }


    // remove duplicates before sending to backend
    let updatedUser;
    try {

      for (const userRole of selectedUser.data[0].userRoles) {
        let roleItems = userRole.roles.map((item) => item.toString());
        let uniqueList = [...new Set(roleItems)];
        userRole.roles = uniqueList;
        const index = selectedUser.data[0].userRoles.indexOf(_userRole => _userRole._id === userRole._id);
        selectedUser.data[0].userRoles[index] = userRole;
        try {
          updatedUser = await usersService.patch(selectedUser.data[0]._id, {
            userRoles: selectedUser.data[0].userRoles
          });
        } catch (error) {}
      }
    } catch (error) {}



    // let updatedUser = await usersService.patch(selectedUser.data[0]._id, {
    //   userRoles: selectedUser.data[0].userRoles
    // });
    return updatedUser;

  }

  removeRole(selectedUser, role, index) {
    selectedUser.data[0].userRoles[index].roles.forEach((rol, i) => {
      if (rol.toString() == role.toString()) {
        selectedUser.data[0].userRoles[index].roles.splice(i, 1);
        this.removeRole(selectedUser, role, index);
      }
    });

    return selectedUser;
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
