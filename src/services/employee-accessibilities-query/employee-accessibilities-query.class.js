/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
	constructor(options) {
		this.options = options || {};
	}

	async find(params) {
		// console.log(1);
		const employeeService = this.app.service('employees');
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

			let roleFeatures = features.data.map((record) => record.actions.map((action) => action._id.toString()));
			roleFeatures = [].concat.apply(...(roleFeatures || []));

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
				items = items.map((item) => item.toString());
				var uniqueItems = [ ...new Set(items) ];
				const userHasRole = uniqueItems.some(
					(v) => access.data.map((acc) => acc._id.toString()).indexOf(v) !== -1
				);
				return jsend.success(userHasRole);
				// return Promise.resolve({
				//   features,
				//   uniqueItems,
				//   access
				// });
			}
		} else if (params.query.employeesWithRoleInFacility) {
			let users, features, access, employees;

			// get personIds of employees in facility
			employees = await employeeService.find({
				query: {
					facilityId: params.query.facilityId,
					$select: [ 'personId' ]
				}
			});

			const personIds = employees.data.map((emp) => emp.personId);

			// get  employee users roles
			try {
				users = await userService.find({
					query: {
						personId: {
							$in: personIds
						},
						'userRoles.facilityId': params.query.facilityId,
						$select: {
							personId: 1,
							'userRoles.$': 1
						}
					}
				});
			} catch (error) {
				console.log(error);
			}
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

			let roleFeatures = features.data.map((record) => record.actions.map((action) => action._id.toString()));
			roleFeatures = [].concat.apply(...(roleFeatures || []));

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
				let usersWithRole = [];
				users.data.forEach((user) => {
					// console.log(user.userRoles);
					// let roles = user.userRoles.map((role) => role.roles);
					user.userRoles.forEach((userRole) => {
						console.log(userRole.roles);
						let roleItems = userRole.roles.map((item) => item.toString());
						var uniqueList = [ ...new Set(roleItems) ];
						const userHasRole = uniqueList.some(
							(v) => access.data.map((acc) => acc._id.toString()).indexOf(v) !== -1
						);
						if (userHasRole) {
							usersWithRole.push(user.personId);
						}
					});

					// usersWithRole.push(uniqueList);
					// console.log(userHasRole);
				});

				const employees = await employeeService.find({
					query: {
						facilityId: params.query.facilityId,
						personId: { $in: usersWithRole }
					}
				});
				try {
					return Promise.resolve({
						employees
					});
				} catch (error) {
					console.log(error);
				}

				// let items = users.data.map(user => user.userRoles.map(role => role.roles)); // .userRoles[0].roles;

				// // call twice to remove 2 level deep arrays
				// items = [].concat.apply(...(items || []));
				// items = [].concat.apply(...(items || []))

				// items = items.map(item => item.toString());
				// var uniqueItems = [...new Set(items)];
				// const userHasRole = uniqueItems.some(v => access.data.map(acc => acc._id.toString()).indexOf(v) !== -1);
				// return jsend.success(uniqueItems);
				// return Promise.resolve({
				//   features,
				//   uniqueItems,
				//   access
				// });
				// return jsend.success(items);
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
			return Promise.all(data.map((current) => this.create(current, params)));
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

module.exports = function(options) {
	return new Service(options);
};

module.exports.Service = Service;
