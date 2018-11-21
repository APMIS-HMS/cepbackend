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
        const FacilityService = this.app.service('facilities');
        const LabRequestService = this.app.service('laboratory-requests');
        let summary = {
            //patientHospitalNo: String,
            pastAppointmets: {},
            currentAppointmets: {},
            futureAppointmets: {},
            
        };
        let startDate = new Date(new Date().setDate(new Date().getDate()));
        let facilityId = params.query.facilityId;
        try {
            let getAppointments;
            if (params.query.startDate === undefined && params.query.endDate === undefined) {
                getAppointments = await AppointmentService.find({ query: {
                    facilityId:facilityId
                   
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
                    ]
                }});
            }else{
                getAppointments = await AppointmentService.find({ query:params.query});
            }
            // let patientIds = getAppointments.data.map(x=>{
            //   return x.patientId;
            // });
            //return jsend.success(getAppointments);
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
                }
            });
           
            return jsend.success(patientAppointmenstSummary);
        } catch (error) {
            console.log('=======Error=======\n',error);
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
