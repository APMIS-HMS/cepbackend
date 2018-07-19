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
        const immunizationRecordService = this.app.service('immunization-records');
        const facilityId = data.facilityId;
        const immunizations = data.immunizations;
        const patientId = data.patientId;

        if (facilityId !== undefined) {
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
        } else {
            return jsend.error('facilityId is undefined!');
        }
    }

    async update(id, data, params) {
        const immunizationRecordService = this.app.service('immunization-records');
        const appointmentService = this.app.service('appointments');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const vaccine = data;
        const patientId = data.patientId;

        if (facilityId !== undefined) {
            if (accessToken !== undefined) {
                const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
                if (userRole.length > 0) {
                    // Get appointment for the vaccine
                    const getAppointment = await appointmentService.get(vaccine.appointmentId);

                    if (getAppointment._id !== undefined) {
                        const appointment = getAppointment;
                        appointment.startDate = vaccine.newAppointmentDate;
                        // Update appointment with the current date.
                        const updateAppoinment = await appointmentService.patch(appointment._id, appointment, {});

                        // Check if appointment save properly
                        if (updateAppoinment._id !== undefined) {
                            // Get patient immunization record.
                            const getPatientsImmunizationRecord = await immunizationRecordService.get(id);

                            if (getPatientsImmunizationRecord._id !== undefined) {
                                const immunizationRecord = getPatientsImmunizationRecord;
                                // Get records that have same appointmentId
                                immunizationRecord.immunizations.forEach(x => {
                                    if (x.appointmentId.toString() === vaccine.appointmentId && !x.administered) {
                                        x.appointmentId = updateAppoinment._id;
                                        x.appointmentDate = vaccine.newAppointmentDate;
                                    }
                                });
                                // Update Immunization record
                                const updateImmunizationRecord = await immunizationRecordService.patch(immunizationRecord._id, immunizationRecord, {});
                                if (updateImmunizationRecord._id !== undefined) {
                                    return jsend.success(updateImmunizationRecord);
                                } else {
                                    return jsend.error('There was a problem updating immunization record.');
                                }
                            } else {
                                return jsend.error('There was a problem fetching patient immunization record.');
                            }
                        } else {
                            return jsend.error('There was a problem updating appointment. Please try again later!');
                        }
                    } else {
                        return jsend.error('There was no appointment set for this record!');
                    }
                } else {
                    return jsend.error('You do not have access to perform this transaction!');
                }
            } else {
                return jsend.error('You do not have access to perform this transaction!');
            }
        } else {
            return jsend.error('facilityId is undefined!');
        }
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