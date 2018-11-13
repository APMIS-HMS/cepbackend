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
        const FacilityService = this.app.service('facilities');
        // date, clinic, total checked in appointments, number of new appointment 
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
            let getFac = await FacilityService.get(facilityId);
            //return jsend.success(getFac);
            if (params.query.startDate === undefined) {
                startDate = new Date(new Date().setDate(new Date().getDate() - 1));
                getAppointment = await AppointmentService.find({
                    query: {
                        facilityId: facilityId,//,
                        $and: [{
                            updatedAt: {
                                $gte: params.query.startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte: Date.now()
                            }
                        }
                        ] 
                    }
                });
            } else if (params.query.startDate !== undefined && params.query.endDate === undefined) {
                getAppointment = await AppointmentService.find({ query: { facilityId: params.query.facilityId } });
            } else if (params.query.startDate === undefined && params.query.endDate !== undefined) {
                getAppointment = await AppointmentService.find({
                    query: {
                        facilityId: data.facilityId,
                        updatedAt: { $gte: params.query.startDate }
                    }
                });
            }
            else {
                getAppointment = await AppointmentService.find({
                    query: {
                        facilityId: params.query.facilityId,
                        $and: [{
                            updatedAt: {
                                $gte: params.query.startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte: params.query.endDate
                            }
                        }
                        ]
                    }
                });
            }
            // Check if appointments
            if (getAppointment.data.length > 0) {
                visit.date = Date.now();
                let newFemaleCount = {};
                 let newMaleCount = {};
               
                

                let clinic = getAppointment.data.map(x => {
                    return {
                        facilityId: x.facilityId,
                        clinic: x.clinicId,
                        _id: x._id,
                        personDetails: x.patientDetails.personDetails,
                        appointmentTypeId: x.appointmentTypeId
                    };
                });
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
                    
                    let summary = {
                        date: Date.now(),
                        clinicName: element,
                        total: res[element].length,
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
                
                return jsend.success(visit);
            }
            else {
                return jsend.success('No record found!');
            }

        } catch (error) {
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
module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
