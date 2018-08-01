/* eslint-disable no-unused-vars */

const service = require('feathers-mongoose');
const request = require('request');
const jsend = require('jsend');
const emailer = require('../../templates/emailer');
var Client = require('node-rest-client').Client;
var Zoom = require('zoomus')({
    'key': 'fXH4ThUQQ-K9buLuROA1UA',
    'secret': 'XiySsm2TqNOBMJD40ZfexU6O5h8uvqbOyMgC'
});
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
        const startTime = data.startTime;
        const topic = data.topic;
        const appointmentId = data.appointmentId;
        const _appointmentService = this.app.service('appointments');
        const appointment = await _appointmentService.get(appointmentId);
        var meeting = {
            host_id: 'tEE78MXDTuOsWnhH5rlk3g',
            type: 2,
            data_type: 'JSON',
            topic: topic,
            start_time: startTime,
            option_jbh: true,
            option_auto_record_type: 'cloud',
            timezone: 'Africa/Bangui'
        };
        // Zoom.user.list(function(res) {
        //     if (res.error) {
        //         console.log('error calling user list');
        //     } else {
        //         console.log('list of users:');
        //         console.log(res);
        //     }
        // });


        let response = await new Promise(resolve => {
            Zoom.meeting.create(meeting, response => resolve(response));
        });
        if (response.error) {
            jsend.error({
                code: 404,
                message: 'An error has occured!'
            });
        } else {
            appointment.zoom = response;
            const patchAppointment = await _appointmentService.patch(appointment._id, appointment, {});
            await emailer.appointment(appointment);
            return { zoom: response, appointment: patchAppointment };
        }

    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        this.app.service('appointments').get(id, {}).
        then(appointment => {
            appointment.zoom = data.zoom;
            return this.saveUpdate(this.app, appointment);
        });
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }
    setup(app) {
        this.app = app;
    }

    updateAppointment(app, appointmentId, zoom) {
        app.service('appointments').get(appointmentId, {}).
        then(appointment => {
            appointment.zoom = zoom;
            return this.saveUpdate(app, appointment);
        });
    }

    saveUpdate(app, appointment) {
        app.service('appointments').update(appointment._id, appointment).then(payload => {
            return payload;
        });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;