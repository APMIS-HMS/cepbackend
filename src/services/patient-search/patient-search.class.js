/* eslint-disable no-unused-vars */
'use strict';
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

    setup(app) {
        this.app = app;
    }

    async find(params) {
        const patientService = this.app.service('patients');
        const peopleService = this.app.service('people');
        const accessToken = params.accessToken;
        const facilityId = params.query.facilityId;
        const searchText = params.query.searchText;
        console.log(params.query.searchText);
        const patientTable = (params.query.patientTable === true) ? params.query.patientTable : false;
        let patientz = [];

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            // if (hasFacility.length > 0) {
            //     // Get Patients
            //     let patients = await patientService.find({
            //         query: {
            //             facilityId: facilityId,
            //             $select: ['personId'],
            //             $limit: false
            //         }
            //     });
            //     if (patients.data.length > 0) {
            //         patients = patients.data.map(x => x.personId);

            //         let people = await peopleService.find({
            //             query: {
            //                 '_id': {
            //                     $in: patients
            //                 },
            //                 $or: [{
            //                         firstName: {
            //                             $regex: searchText,
            //                             '$options': 'i'
            //                         }
            //                     },
            //                     {
            //                         lastName: {
            //                             $regex: searchText,
            //                             '$options': 'i'
            //                         }
            //                     },
            //                     {
            //                         apmisId: {
            //                             $regex: searchText,
            //                             '$options': 'i'
            //                         }
            //                     },
            //                     {
            //                         email: {
            //                             $regex: searchText,
            //                             '$options': 'i'
            //                         }
            //                     },
            //                     {
            //                         otherNames: {
            //                             $regex: searchText,
            //                             '$options': 'i'
            //                         }
            //                     }
            //                 ],
            //                 $limit: (params.query.$limit) ? params.query.$limit : 10,
            //                 $sort: {
            //                     createdAt: -1
            //                 }
            //             }
            //         });
            //         if (people.data.length > 0) {
            //             people = people.data;
            //             const pLength = people.length;
            //             let i = people.length;
            //             let counter = 0;

            //             while (i--) {
            //                 const person = people[i];

            //                 const patients = await patientService.find({
            //                     query: {
            //                         facilityId: facilityId,
            //                         personId: person._id,
            //                         $sort: {
            //                             createdAt: -1
            //                         }
            //                     }
            //                 });
            //                 if (patients.data.length > 0) {
            //                     if (patientTable !== true) {
            //                         person.patientId = patients.data[0]._id;
            //                         person.clientsNo = patients.data[0].clientsNo;
            //                     } else {
            //                         patients.data[0].personDetails = person;
            //                         patientz.push(patients.data[0]);
            //                     }
            //                 }
            //                 counter++;
            //             }

            //             if (pLength === counter) {
            //                 if (patientTable !== true) {
            //                     return jsend.success(people);
            //                 } else {
            //                     return jsend.success(patientz);
            //                 }
            //             }
            //         } else {
            //             return jsend.success([]);
            //         }
            //     } else {
            //         return jsend.success([]);
            //     }
            // } else {
            //     return jsend.error('Sorry! But you can not perform this transaction.');
            // }






            // Populate using async/await.
            console.log('am going there');
            const commentsLoaderAwait = new BatchLoader(async keys => {
                console.log('listing coming keys');
                console.log(keys);
                console.log('end listing keys');
                const postRecords = await peopleService.find({

                    query: {
                        _id: {
                            $in: getUniqueKeys(keys)
                        },
                        $or: [{
                                firstName: {
                                    $regex: searchText,
                                    '$options': 'i'
                                }
                            },
                            {
                                lastName: {
                                    $regex: searchText,
                                    '$options': 'i'
                                }
                            },
                            {
                                apmisId: {
                                    $regex: searchText,
                                    '$options': 'i'
                                }
                            },
                            {
                                email: {
                                    $regex: searchText,
                                    '$options': 'i'
                                }
                            },
                            {
                                otherNames: {
                                    $regex: searchText,
                                    '$options': 'i'
                                }
                            }
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $sort: {
                            createdAt: -1
                        }
                    }

                });
                return getResultsByKey(keys, postRecords.data, comment => comment._id, '!');
            }, {
                batch: true,
                cache: true
            });
            const postRecords = await patientService.find({
                query: {
                    facilityId: facilityId,
                    $select: ['personId'],
                    $limit: false
                },
                excludePopulate: true

            });
            // console.log(postRecords);
            const patients = postRecords.data.map(x => x.personId);
            // console.log(patients);
            const post = await commentsLoaderAwait.loadMany(patients);
            console.log(post.filter(x => x !== null));
            // return post;
            return jsend.success(post);
            // const data = await Promise.all(postRecords.data.map(async post => {
            //     // console.log(post);
            //     post.commentRecords = await commentsLoaderAwait.load(post.personId);

            //     return post;
            // }));

















        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
        }
    }

    get(data, params) {

    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
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
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;