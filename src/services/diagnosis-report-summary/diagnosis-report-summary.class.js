/* eslint-disable no-unused-vars */
let jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }
    setup(app){
        this.app = app;
    }
    find (params) {
        let DiagnosisService = this.app.service('diagnosises');
        let diagnosisSummary = {
            hospitalNo:String, 
            gender:String,
            age:Number,
            diagnosis:String,
            codeNo:String
        };
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
