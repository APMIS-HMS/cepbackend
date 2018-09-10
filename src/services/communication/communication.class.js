/* eslint-disable no-unused-vars */
const emailerTemplate = require('../../templates/emailer');
const emailLabel = require('../../parameters/email-label');
const smsLabel = require('../../parameters/sms-label');
const smsTemplate = require('../../templates/sms-sender');
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
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const communicateService = this.app.service('communicate');
        let createCommunicate;
        let communicateTem = {};
        try {
            if (params.query.label.toString() == emailLabel.emailType.notification.toString()) {
                emailerTemplate.notification(data);
            } else if (params.query.label.toString() == smsLabel.smsType.notification.toString()) {
                smsTemplate.sendNotification(data);
            } else {
                let channel = data.channel;
                let con = this.app.channel(channel).connections;
                con.send(data.message);
                createCommunicate = await communicateService.create(communicateTem);
                console.log('\n createCommunicate: \n', createCommunicate);
            }
        } catch (error) {
            jsend.error(error);
        }

        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }

        return Promise.resolve(createCommunicate);
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

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
