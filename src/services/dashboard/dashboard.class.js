/* eslint-disable no-unused-vars */
const  jsend = require('jsend');

class Service {
    constructor (options) {
        this.options = options || {};
    }
    setup(app){
        this.app = app;
    }

    find (params) {
        const LabRequestService = this.app.service('laboratory-requests');
        const appoinmentService = this.app.service('appointments');
        try {
            //
        } catch (error) {
            return jsend.error(error);
        }
        return Promise.resolve([]);
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
