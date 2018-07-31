/* eslint-disable no-unused-vars */

const service = require('feathers-mongoose');
const request = require('request');
const jsend = require('jsend');

var Client = require('node-rest-client').Client;
var Zoom = require("zoomus")({
    "key": 'fXH4ThUQQ-K9buLuROA1UA',
    "secret": 'XiySsm2TqNOBMJD40ZfexU6O5h8uvqbOyMgC'
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

        console.log(data);
        console.log(params);
        var startTime = data.startTime;
        var topic = data.topic;
        var appointmentId = data.appointmentId;
        var meeting = {
            host_id: 'XO_fV9abS4mUmuzi8TriQg',
            type: 2,
            data_type: 'JSON',
            topic: topic,
            start_time: startTime,
            option_jbh: true,
            option_auto_record_type: 'cloud',
            timezone: 'Africa/Bangui'
        };
        Zoom.meeting.create(meeting, function(response) {
            if (response.error) {

                jsend.error({
                    code: 404,
                    message: 'An error has occured!'
                });
            } else {
                let appointment = this.updateAppointment(this.app, appointmentId, response);
                request.send({ zoom: response.body, appointment: appointment });
                jsend.success(appointment);
            }
        });
        return Promise.resolve(data);
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