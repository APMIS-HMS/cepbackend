/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }
    setup(app){
        this.app = app;
    }

    async find (params) {
        const AppointmentService = this.app.service('appointments');
        
        let summary = {
            pastAppointmets: {},
            currentAppointmets: {},
            futureAppointmets: {},
        };

        let startDate = new Date(new Date().setHours(0,0,0,0));
        let facilityId = params.query.facilityId;
        try {
            let getAppointments;
            if (params.query.startDate === undefined && params.query.endDate === undefined) {
                getAppointments = await AppointmentService.find({ query: {
                    facilityId:facilityId,
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
                } });
            }else if(params.query.startDate !== undefined && params.query.endDate !== undefined) {
            //
                getAppointments = await AppointmentService.find({ query: {
                    facilityId:facilityId,
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
                    ],
                    $limit: (params.query.$limit) ? params.query.$limit : 10,
                    $skip:(params.query.$skip)?params.query.$skip:0
                }});
            }else if(params.query.providerName !== undefined || params.query.patientName !== undefined) {
                //
                getAppointments = await AppointmentService.find({ query: {
                    facilityId:facilityId,
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
                    ],
                    $limit: (params.query.$limit) ? params.query.$limit : false,
                    $skip:(params.query.$skip)?params.query.$skip:0
                }});
            }
            
            let patientAppointmenstSummary = getAppointments.data.map(x=>{
                let name=(x.providerDetails !== undefined)?x.providerDetails.personDetails.firstName
              +' '+x.providerDetails.personDetails.lastName:'No provider';
                let fullName = x.patientDetails.personDetails.firstName +' '+x.patientDetails.personDetails.lastName;
                let providerTitle = (x.providerDetails !== undefined)?x.providerDetails.personDetails.title+' ':'No title';
                let patientTitle =x.patientDetails.personDetails.title+' ';
                return {
                    provider:providerTitle+name,
                    patientApmisId:x.patientDetails.personDetails.apmisId,
                    patientName:patientTitle+fullName,
                    appointmentType:x.appointmentTypeId,
                    phone:x.patientDetails.personDetails.primaryContactPhoneNo,
                    time:x.startDate,
                    status:x.orderStatusId
                };
            });

            //Filter by provider
            let provider = params.query.providerName;
            if(provider !== undefined){
                let doctor = patientAppointmenstSummary.filter(x=>x.provider.indexOf(provider)>-1);
                if(doctor.length>0){
                    return jsend.success(doctor);
                }else{
                    return jsend.success([]);
                }
               
            }
            //Filter by patientName
            let patient = params.query.patientName;
            if(patient !== undefined){
                let patientName = patientAppointmenstSummary.filter(x=>x.patientName.indexOf(patient)>-1);
                if(patientName.length>0){
                    return jsend.success(patientName);
                }else{
                    return jsend.success([]);
                }
            }
            //Filter by status
            let status = params.query.status;
            if(status !== undefined && status !== 'All'){
                let getAllByStatus = patientAppointmenstSummary.filter(x=>x.status===status);
                if(getAllByStatus.length>0){
                    return jsend.success(getAllByStatus);
                }else{
                    return jsend.success([]);
                }
                
            }else if(status !== undefined && status === 'All'){
                return jsend.success(patientAppointmenstSummary);
            }
            return jsend.success(patientAppointmenstSummary);
        } catch (error) {
            return jsend.error(error);
        }

    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create (data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }

        return Promise.resolve(data);
    }

    update (id, data, params) {
        return Promise.resolve(data);
    }

    patch (id, data, params) {
        return Promise.resolve(data);
    }

    remove (id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
