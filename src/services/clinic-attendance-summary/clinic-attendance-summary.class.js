/* eslint-disable no-unused-vars */
let jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    setup(app){
        this.app = app;
    }

    async find (params) {
        const AppointmentService = this.app.service('appointments');
        // date, clinic, total checked in appointments, number of new appointment 
        let visit = [];
        let getAppointment;
        let startDate = params.query.startDate;
        let endDate = params.query.endDate;
        let facilityId = params.query.facilityId;
        let appointments = [];
        let newAppointmentTypeCount;
        let followUpAppointmentTypeCount;
        let newMalePatientCount;
        let folloUpMalePatientCount;
        let newFemalePatientCount;
        let followUpFemalePatientCount;
        let summary = {};
        
            
        try {
            if(params.query.startDate === undefined){
                startDate = new Date(new Date().setDate(new Date().getDate()-1));
                getAppointment = await AppointmentService.find({
                    query:{facilityId:facilityId//,
                        //updatedAt: {$gte:startDate} 
                    }});
            }else if(params.query.startDate !== undefined && params.query.endDate === undefined){
                getAppointment = await AppointmentService.find({query:{facilityId:params.query.facilityId}});
            }else if(params.query.startDate === undefined && params.query.endDate !== undefined){
                getAppointment = await AppointmentService.find({
                    query:{
                        facilityId:data.facilityId,
                        updatedAt: {$gte: params.query.startDate}
                    }
                });
            }
            else{
                getAppointment = await AppointmentService.find({
                    query:{
                        facilityId:params.query.facilityId,
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
            if(getAppointment.data.length>0){
                visit.date = Date.now();
                let totalCheckedInPatients = getAppointment.data.filter(x => x.attendance).length;
                console.log('OK o \n', totalCheckedInPatients);
                let GroupedByClinic={};
                let newFemaleCount={};
                let newMaleCount={};

                
                appointments = getAppointment.data.map(x=>{
                    GroupedByClinic = getAppointment.data.filter(item => item.clinicId === x.clinicId);
                }); console.log('OK \n', GroupedByClinic.length);
                   
                newFemaleCount = GroupedByClinic.filter(item => item.providerDetails.patientDetails.gender === 'female');
                newMaleCount = GroupedByClinic.filter(item => item.providerDetails.patientDetails.gender === 'male');
                followUpFemalePatientCount = GroupedByClinic.filter(item => item.providerDetails.patientDetails.gender === 'female');
                folloUpMalePatientCount = GroupedByClinic.filter(item => item.providerDetails.patientDetails.gender === 'male');
                newAppointmentTypeCount = GroupedByClinic.filter(item => item.appointmentTypeId === 'New');
                followUpAppointmentTypeCount = GroupedByClinic.filter(item => item.appointmentTypeId.toLowerCase() === 'follow up');

                let summary = {
                    date: Date.now(),
                    clinicName: '',
                    totalCheckedInPatients:totalCheckedInPatients ,
                    new: {
                        total: newAppointmentTypeCount.length,
                        totalFemale: newFemaleCount.length,
                        totalMale: newMaleCount.length
                    },
                    followUp: {
                        total: followUpAppointmentTypeCount.length,
                        totalFemale: followUpFemalePatientCount.length,
                        totalMale: folloUpMalePatientCount.length
                    }
                };
                visit.push(summary);
                return jsend.success(visit);
            }
            else {
                return jsend.success('No record found!');
            }

        } catch (error) {
            return jsend.error({message:'Something went wrong',code:508,data:{detail:error}});
        }
    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create (data, params) {
        
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

Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
        console.log('Me \n', groups, item);
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
};

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
