/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }
    setup(app) {
        this.app = app;
    }

    async find(params) {
        const AppointmentService = this.app.service('appointments');
        const LabRequestService = this.app.service('laboratory-requests');

        let summary = {};
        let facilityId = params.query.facilityId;
        let startDate = new Date(new Date().setDate(new Date().getDate()));
        try {
            let getAppointments;
            if (params.query.startDate === undefined && params.query.endDate === undefined) {
                console.log(startDate);
                getAppointments = await AppointmentService.find({ query: { 
                    facilityId: facilityId,
                    updatedAt: {
                        $gte: startDate
                    }
                } });
            }
            //find by date range
            else if (params.query.startDate !== undefined && params.query.endDate !== undefined) {
                getAppointments = await AppointmentService.find({
                    query: {
                        facilityId: facilityId,
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
            else{
                getAppointments = await AppointmentService.find({query:params.query});
            }
            let patientIds = getAppointments.data.map(x => {
                return x.patientId;
            });
            let getLabRequests = await LabRequestService.find({ query: { 'patientId': { $in: patientIds } } });
            let patientAppointmenstSummary = getAppointments.data.map(x => {
                return {
                    patientId: x.patientId,
                    patientName: x.patientDetails.personDetails.firstName,
                    apmisId: x.patientDetails.personDetails.apmisId,
                    gender: x.patientDetails.personDetails.gender,
                    age: x.patientDetails.personDetails.age,
                    ICD10Code: '',
                    diagnosis: ''
                }
            });
            let diagnosisSummary;
            patientAppointmenstSummary.forEach(e => {
                diagnosisSummary = getLabRequests.data.map(x => {

                    if (x.patientId === e.patientId) {
                        e.diagnosis = x.diagnosis;
                    }
                    return e;
                });

            });

            summary.totalAppointments = (diagnosisSummary !== undefined)?diagnosisSummary.length:0;
            if(diagnosisSummary!==undefined){
                diagnosisSummary.summary = summary;
                return jsend.success(diagnosisSummary);
            }else{
                return jsend.success([]);  
            }
            
        } catch (error) {
            return jsend.error(error);
        }

    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
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
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
