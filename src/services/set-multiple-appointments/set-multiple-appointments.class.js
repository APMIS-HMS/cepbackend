/* eslint-disable no-unused-vars */
var addHours = require('date-fns/add_hours');
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
        const immunizationScheduleService = this.app.service('immunization-schedule');
        const selectedImmunizationSchedule = await immunizationScheduleService.get(data.immunizationScheduleId);

        const vaccines = selectedImmunizationSchedule.vaccines;
        const checkedVaccines = vaccines.filter(vaccine => {
            return data.vaccineIds.find(vac => {
                return vac == vaccine._id;
            });
        });
        // console.log(selectedImmunizationSchedule);
        // console.log(checkedVaccines);
        // console.log(data.appointment);
        let appointments = [];
        let firstAppointment;
        checkedVaccines.forEach(vaccine => {
            vaccine.intervals.forEach((interval, i) => {
                console.log(i);
                if (i === 0) {
                    if (firstAppointment == undefined) {
                        firstAppointment = JSON.parse(JSON.stringify(data.appointment));
                    }
                    firstAppointment.appointmentReason = firstAppointment.appointmentReason == null ? vaccine.name + ' ' : firstAppointment.appointmentReason + ' ' + vaccine.name;

                } else {
                    const appointmentDate = addHours(new Date(), this.convertInterval(interval));
                    console.log(appointmentDate);
                    let currentAppointment = JSON.parse(JSON.stringify(data.appointment));
                    currentAppointment.startDate = appointmentDate;
                    appointments.push(currentAppointment);
                }
            });
        });
        console.log(appointments);
        console.log(firstAppointment);
        data._id = 3493438;
        return Promise.resolve(data);
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

    update(id, data, params) {
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