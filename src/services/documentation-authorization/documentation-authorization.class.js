/* eslint-disable no-unused-vars */
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
        const _tokenService = this.app.service('get-tokens');
        if (params.type === 'patient') {
            const _patientService = this.app.service('patients');
            const patientId = params.patientId;
            const patient = await _patientService.get(patientId);
            const token = await _tokenService.get('userVerification');

            patient.documentationAuthorizationCode = '';
        } else if (params.type === 'medical') {}
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
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