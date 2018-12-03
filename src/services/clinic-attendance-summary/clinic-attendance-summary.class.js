/* eslint-disable no-unused-vars */
let jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        const AppointmentService = this.app.service('appointments');
        
        let visit = [];
        let getAppointment;
        let startDate = params.query.startDate;
        let endDate = params.query.endDate;
        let facilityId = params.query.facilityId;
        let newAppointmentTypeCount;
        let followUpAppointmentTypeCount;
        let folloUpMalePatientCount;
        let followUpFemalePatientCount;
        
        try {
            
            if (params.query.startDate === undefined) {
                startDate = new Date(new Date().setHours(0,0,0,0));
                getAppointment = await AppointmentService.find({
                    query: {
                        facilityId: facilityId,
                        $and: [{
                            updatedAt: {
                                $gte:startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte:Date.now()
                            }
                        }
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0 
                    }
                });//return getAppointment;
            }else {
                getAppointment = await AppointmentService.find({
                    query: {
                        facilityId: params.query.facilityId,
                        $and: [{
                            updatedAt: {
                                $gte:startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte:endDate
                            }
                        }
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0
                    }
                });
            }
            // Check if appointment array is not empty
            
            if (getAppointment.data.length > 0) {
                visit.date = Date.now();
                let newFemaleCount = {};
                let newMaleCount = {};

                //Filter clinic 
                let clinic = getAppointment.data.map(x => {
                    return {
                        facilityId: x.facilityId,
                        clinic: x.clinicId,
                        _id: x._id,
                        personDetails: x.patientDetails.personDetails,
                        appointmentTypeId: x.appointmentTypeId
                    };
                });
                // Filter clinics to take out redundancy
                let clinicNames = [... new Set(clinic.map(x => x.clinic))];

                let res = {};
                clinicNames.forEach(element => {
                    res[element] = [];
                    let newMale = [], newFemale = [], followUpmale = [], followUpFemale = [];
                    newAppointmentTypeCount=0;
                    followUpAppointmentTypeCount=0;

                    clinic.forEach(clinic => {
                        if (clinic.clinic === element) {
                            res[element].push(clinic);
                            //return jsend.success(element);
                            if (clinic.appointmentTypeId === 'New') {
                                newAppointmentTypeCount++;
                                if (clinic.personDetails.gender.toLowerCase() === 'male') {
                                    newMale.push(clinic);
                                } else {
                                    newFemale.push(clinic);
                                }
                            } else {
                                followUpAppointmentTypeCount++;
                                if (clinic.personDetails.gender.toLowerCase() === 'male') {
                                    followUpmale.push(clinic);
                                } else {
                                    followUpFemale.push(clinic);
                                }
                            }
                        }
                    });
                    newMaleCount = newMale.length;
                    newFemaleCount = newFemale.length;
                    followUpFemalePatientCount = followUpFemale.length;
                    folloUpMalePatientCount = followUpmale.length;
                    //return clinic;
                    let summary = {
                        date: new Date(new Date()),
                        clinicName: element,
                        grandTotal: res[element].length,
                        new: {
                            total: newAppointmentTypeCount,
                            totalFemale: newFemaleCount,
                            totalMale: newMaleCount
                        },
                        followUp: {
                            total: followUpAppointmentTypeCount,
                            totalFemale: followUpFemalePatientCount,
                            totalMale: folloUpMalePatientCount
                        }
                    };
                    visit.push(summary);

                });

                //Filter by PatientName
                
                //Filter by ProviderName
                
                return jsend.success(visit);
            }
            else {
                return jsend.success([]);
            }

        } catch (error) {
            console.log('============\n',error);
            return jsend.error({ message: 'Something went wrong', code: 508, data: { detail: error } });
        }
    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {

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
        return Promise.resolve({ id });
    }
}

Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        console.log('Me \n', groups, item);
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
};

Array.prototype.getUnique = function () {
    var o = {}, a = [], i, e;
    for (i = 0; e === this[i]; i++) { o[e] = 1; }
    for (e in o) { a.push(e); }
    return a;
};

function filterList(q, list) {
    function escapeRegExp(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    const words = q
        .split(/\s+/g)
        .map(s => s.trim())
        .filter(s => !!s);
    const hasTrailingSpace = q.endsWith(' ');
    const searchRegex = new RegExp(
        words
            .map((word, i) => {
                if (i + 1 === words.length && !hasTrailingSpace) {
                    // The last word - ok with the word being "startswith"-like
                    return `(?=.*\\b${escapeRegExp(word)})`;
                } else {
                    // Not the last word - expect the whole word exactly
                    return `(?=.*\\b${escapeRegExp(word)}\\b)`;
                }
            })
            .join('') + '.+','gi'
    );
    return list.filter(item => {
        return searchRegex.test(item.title);
    });
}
module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
