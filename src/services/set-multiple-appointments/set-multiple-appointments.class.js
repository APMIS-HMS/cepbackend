/* eslint-disable no-unused-vars */
var addHours = require('date-fns/add_hours');
var isSameDay = require('date-fns/is_same_day');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({ id, text: `A new message with ID: ${id}!` });
    }

    async create(data, params) {
        const immunizationScheduleService =
            this.app.service('immunization-schedule');
        const appointmentService = this.app.service('appointments');
        const crudImmunizationRecordService =
            this.app.service('crud-immunization-record');
        const selectedImmunizationSchedule =
            await immunizationScheduleService.get(data.immunizationScheduleId);

        const vaccines = selectedImmunizationSchedule.vaccines;
        const checkedVaccines = vaccines.filter(vaccine => {
            return data.vaccineIds.find(vac => {
                return vac == vaccine._id;
            });
        });
        let appointments = [];
        let immunizationRecords = {
            patientId: data.appointment.patientId,
            facilityId: data.appointment.facilityId,
            immunizations: []
        };
        let firstAppointment;
        checkedVaccines.forEach(vaccine => {
            vaccine.intervals.forEach((interval, i) => {
                if (i === 0) {
                    if (firstAppointment == undefined) {
                        firstAppointment = JSON.parse(JSON.stringify(data.appointment));
                    }

                    let existingAppointment = this.appointmentDateBooked(
                        appointments, data.appointment.startDate);
                    if (existingAppointment == null) {
                        firstAppointment.appointmentReason =
                            firstAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            firstAppointment.appointmentReason + ' ' + vaccine.name;


                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = firstAppointment.startDate;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);

                        appointments.push(firstAppointment);
                    } else {
                        console.log('else 1');
                        existingAppointment.appointmentReason =
                            existingAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            existingAppointment.appointmentReason + ' || ' + vaccine.name;


                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = existingAppointment.startDate;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);


                        appointments.push(existingAppointment);
                    }

                } else {
                    const appointmentDate = addHours(
                        data.appointment.startDate, this.convertInterval(interval));
                    let currentAppointment = JSON.parse(JSON.stringify(data.appointment));



                    currentAppointment.startDate = appointmentDate;
                    let existingAppointment = this.appointmentDateBooked(
                        appointments, currentAppointment.startDate);
                    console.log(existingAppointment);
                    if (existingAppointment == null) {
                        currentAppointment.appointmentReason =
                            currentAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            currentAppointment.appointmentReason + ' ' + vaccine.name;



                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = currentAppointment.startDate;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);



                        appointments.push(currentAppointment);
                    } else {
                        console.log('else 2');
                        existingAppointment.appointmentReason =
                            existingAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            existingAppointment.appointmentReason + ' || ' + vaccine.name;


                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = existingAppointment.startDate;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);


                        appointments.push(existingAppointment);
                    }
                }
            });
        });
        data._id = 3493438;
        const createdAppointments = await appointmentService.create(appointments);
        createdAppointments.forEach(
            appointment => {
                immunizationRecords.immunizations.forEach(record => {
                    if (isSameDay(appointment.startDate, record.appointmentDate)) {
                        record.appointmentId = appointment._id;
                    }
                })
            })
        const createdImmunizationRecords =
            await crudImmunizationRecordService.create(immunizationRecords);
        return Promise.resolve({ createdAppointments, createdImmunizationRecords });
    }

    appointmentDateBooked(appointments, comingDate) {
        let retVal = undefined;
        for (var i = 0; i < appointments.length; i++) {
            if (isSameDay(appointments[i].startDate, comingDate)) {
                retVal = appointments[i];
                appointments.splice(i, 1);
                break;
            }
        }

        return retVal;
    }

    convertInterval(interval) {
        if (interval.unit === 'Months') {
            return interval.duration * 28 * 24;
        } else if (interval.unit === 'Weeks') {
            return interval.duration * 7 * 24;
        } else if (interval.unit === 'Days') {
            return interval.duration * 24;
        } else if (interval.unit === 'Hours') {
            return interval.duration;
        }
    }

    async update(id, data, params) {
        const immunizationRecordService = this.app.service('immunization-records');

        let immunizationRecordArray = await immunizationRecordService.find({ query: { 'patientId': data.appointment.patientId } });
        let immunizationRecordObj = immunizationRecordArray.data.length > 0 ?
            immunizationRecordArray.data[0] :
            undefined;
        if (immunizationRecordObj !== undefined) {
            let immunizations = immunizationRecordObj.immunizations;
            immunizations =
                immunizations.filter(e => e.appointmentId != data.appointment._id);

            const immunizationScheduleService =
                this.app.service('immunization-schedule');
            const appointmentService = this.app.service('appointments');
            const crudImmunizationRecordService =
                this.app.service('crud-immunization-record');
            const selectedImmunizationSchedule =
                await immunizationScheduleService.get(data.immunizationScheduleId);

            const vaccines = selectedImmunizationSchedule.vaccines;
            const checkedVaccines = vaccines.filter(vaccine => {
                return data.vaccineIds.find(vac => {
                    return vac == vaccine._id;
                });
            });



            let appointments = [];
            let immunizationRecords = {
                patientId: data.appointment.patientId,
                facilityId: data.appointment.facilityId,
                immunizations: []
            };
            let firstAppointment = data.appointment;
            checkedVaccines.forEach(vaccine => {
                vaccine.intervals.forEach((interval, i) => {
                    if (i === 0) {
                        let existingAppointment = data.appointment;
                        existingAppointment.appointmentReason =
                            existingAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            existingAppointment.appointmentReason + ' || ' + vaccine.name;

                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = existingAppointment.startDate;
                        immunizationObj.appointmentId = existingAppointment._id;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);


                        appointments.push(existingAppointment);

                    } else {
                        const appointmentDate = addHours(
                            data.appointment.startDate, this.convertInterval(interval));
                        let currentAppointment =
                            JSON.parse(JSON.stringify(data.appointment));

                        currentAppointment.startDate = appointmentDate;
                        let existingAppointment = data.appointment;
                        existingAppointment.appointmentReason =
                            existingAppointment.appointmentReason == null ?
                            vaccine.name + ' ' :
                            existingAppointment.appointmentReason + ' || ' + vaccine.name;


                        let immunizationObj = {};
                        immunizationObj.immunizationScheduleId =
                            data.immunizationScheduleId;
                        immunizationObj.immunizationName =
                            selectedImmunizationSchedule.name;
                        immunizationObj.vaccine = {
                            name: vaccine.name,
                            nameCode: vaccine.nameCode,
                            code: vaccine.code,
                            vaccinationSite: vaccine.vaccinationSite,
                            numberOfDosage: vaccine.numberOfDosage,
                            dosage: vaccine.dosage,
                            serviceId: vaccine.serviceId,
                            _id: vaccine._id
                        }
                        immunizationObj.sequence = interval.sequence;
                        immunizationObj.appointmentDate = existingAppointment.startDate;
                        immunizationObj.appointmentId = existingAppointment._id;
                        immunizationObj.administered = false;

                        immunizationRecords.immunizations.push(immunizationObj);


                        appointments.push(existingAppointment);
                    }
                });
            });

            return Promise.resolve({ appointments });
        }



        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;