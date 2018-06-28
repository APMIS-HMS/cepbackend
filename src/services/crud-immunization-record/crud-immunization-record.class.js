/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        console.log('Data => ', data);
        console.log('params => ', params);
        const immunizationRecordService = this.app.service('immunization-records');
        // const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const immunizations = data.immunizations;
        const patientId = data.patientId;

        if (facilityId !== undefined) {
            // if (accessToken !== undefined) {
            //     const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            // if (userRole.length > 0) {
            if (immunizations.length > 0) {
                // Get patient immunization record.
                const getPatientsImmunizationRecord = await immunizationRecordService.find({
                    query: {
                        facilityId: facilityId,
                        patientId: patientId
                    }
                });

                if (getPatientsImmunizationRecord.data.length > 0) {
                    const immunizationRecord = getPatientsImmunizationRecord.data[0];
                    // Merge array from the immunization record and the new array from the client
                    immunizationRecord.immunizations = immunizationRecord.immunizations.concat(immunizations);
                    // Update Immunization record
                    const updateImmunizationRecord = await immunizationRecordService.patch(immunizationRecord._id, immunizationRecord, {});
                    if (updateImmunizationRecord._id !== undefined) {
                        return jsend.success(updateImmunizationRecord);
                    } else {
                        return jsend.error('There was a problem updating immunization record.');
                    }
                } else {
                    // Create Immunization record with the data sent from the client
                    const createImmunizationRecord = await immunizationRecordService.create(data);

                    if (createImmunizationRecord._id !== undefined) {
                        return jsend.success(createImmunizationRecord);
                    } else {
                        return jsend.error('There was a problem creating immunization record.');
                    }
                }
            } else {
                return jsend.error('immunizations array is empty.');
            }
            // } else {
            //     return jsend.error('You have not been assigned to this facility.');
            // }
            // } else {
            //     return jsend.error('You need to log in to perform this transaction');
            // }
            // if (immunizationScheduleId !== undefined) {

            //     //immunizations.push(patientId);
            //     const immunizationSch = await immuScheduleService.find({ query: { _id: immunizationScheduleId } });

            //     const getVaccines = immunizationSch.data[0].vaccines;

            //     if (getVaccines.length > 0) {


            //         let vaccine = {
            //             vaccine: String,
            //             appointments: appointments
            //         };


            //         let vac = [];
            //         if (getVaccines.length > 0) {
            //             getVaccines.forEach(element => {
            //                 // appointments.forEach(appoint => {
            //                 // if(element.serviceId === appoint.serviceId){
            //                 vaccine.vaccine = element;
            //                 vaccine.appointments = appointments;
            //                 //vaccine.appointments = appoint;
            //                 vac.push(vaccine);
            //                 // }

            //                 // });

            //             });

            //             let immune = {
            //                 immunizationScheduleId: immunizationScheduleId,
            //                 immunizationName: immunizationSch.data[0].name,
            //                 vaccines: vac
            //             };

            //             let ImmHistory = {
            //                 facilityId: data.facilityId,
            //                 patientId: data.patientId,
            //                 immunizations: immune
            //             };

            //             try {
            //                 const history = await immunizationRecordService.create(ImmHistory);


            //                 if (history.immunizations.length > 0) {
            //                     let appt = {
            //                         date: Date.now,
            //                         status: 'valid',
            //                         isPast: false,
            //                         isFuture: true,
            //                         completed: false,
            //                         appointmentId: data.appointmentId
            //                     };
            //                     try {
            //                         const appoint = await appointmentServices.create(appt);
            //                     } catch (error) {
            //                         return jsend.error('Could not post to Immunization appointments schedul');
            //                     }

            //                 }
            //                 //return jsend.success(history);

            //             } catch (error) {
            //                 return jsend.error('Something went wrong ========>>>>>>>>> ', error);
            //             }

            //         } else {
            //             return jsend.error('No vaccine found');
            //         }
            //     }
            // } else {
            //     return jsend.error('Immunization schedule not found!');
            // }
        } else {
            return jsend.error('facilityId is undefined!');
        }
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