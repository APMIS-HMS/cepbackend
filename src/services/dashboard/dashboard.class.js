/* eslint-disable no-unused-vars */
const  jsend = require('jsend');

class Service {
    constructor (options) {
        this.options = options || {};
    }
    setup(app){
        this.app = app;
    }

    async find (params) {
        const appoinmentService = this.app.service('appointments');
        try {
            let getAppointments;
            let visit = [];
            let startDate = params.query.startDate;
            let endDate = params.query.endDate;
            let facilityId = params.query.facilityId;
            let newAppointmentTypeCount;
            let followUpAppointmentTypeCount;
            
            if (params.query.startDate === undefined) {
                startDate = new Date();
                getAppointments = await appoinmentService.find({
                    query: {
                        facilityId: facilityId,
                        $and: [{
                            updatedAt: {
                                $gte: startDate.setHours(0,0,0,0)
                            }
                        },
                        {
                            updatedAt: {
                                $lte: Date.now()
                            }
                        }
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0
                    }
                });
            }else {
                getAppointments = await appoinmentService.find({
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

            //Check if appointment array is empty

            if (getAppointments.data.length > 0) {
                visit.date = Date.now();

                let clinic = getAppointments.data.map(x => {
                    return {
                        facilityId: x.facilityId,
                        clinic: x.clinicId,
                        _id: x._id,
                        personDetails: x.patientDetails.personDetails,
                        appointmentTypeId: x.appointmentTypeId,
                        isCheckedOut:x.isCheckedOut,
                        attendance: (x.attendance !== undefined) ? x.attendance : 'Absent'  
                    };
                });
                let clinicNames = [... new Set(clinic.map(x => x.clinic))];

                let res = {};
                
                clinicNames.forEach(element => {
                    res[element] = [];
                    newAppointmentTypeCount=0;
                    followUpAppointmentTypeCount=0;
                    let isCheckedOutCount = 0;
                    let isWaitingCount = 0;
                    let isCheckedIn = 0;
                    clinic.forEach(clinic => {
                        if (clinic.clinic === element) {
                            res[element].push(clinic);
                            //return jsend.success(element);
                            if (clinic.appointmentTypeId === 'New') {
                                newAppointmentTypeCount++;
                            } else {
                                followUpAppointmentTypeCount++;
                            }
                            if(clinic.isCheckedOut === true){
                                isCheckedOutCount++;
                            }else if(clinic.isCheckedOut === false && clinic.attendance !== 'Absent'){
                                isWaitingCount++;
                            }
                            if(clinic.attendance !== 'Absent'){
                                isCheckedIn++;
                            }
                        }
                    });
                    
                    let summary = {
                        date: new Date(new Date()),
                        clinicName: element,
                        totalConsultation: res[element].length,
                        newAppointment: {
                            total: newAppointmentTypeCount
                        },
                        followUpAppointment: {
                            total: followUpAppointmentTypeCount,
                        },
                        totalCheckIn:isCheckedIn,
                        totalCheckedOut:isCheckedOutCount,
                        totalWaiting:isWaitingCount
                    };
                    visit.push(summary);

                });
              
                return jsend.success(visit);
            }
            else {
                return jsend.success([]);
            }
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
