/* eslint-disable no-unused-vars */
const tokenLabel = require('../../parameters/token-label');
var isToday = require('date-fns/is_today');
var addMinutes = require('date-fns/add_minutes');
var isFuture = require('date-fns/is_future');
const jsend = require('jsend');
const sms = require('../../templates/sms-sender');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        if (params.query.type === 'patient') {
            const _patientService = this.app.service('patients');
            const patientId = params.query.patientId;
            let patient = await _patientService.get(patientId);
            const token = params.query.token;
            const code = patient.documentationAuthorizationCode;
            if (code.attempts.length > 2 && isFuture(code.tryAgainAt)) {
                return jsend.fail('Please attempt back in ' + code.tryAgainAt);
            } else if (code.documentationAuthorizationCode === token) {
                code.attempts = [];
                patient.documentationAuthorizationCode = code;
                patient = await _patientService.update(patient._id, patient, {});
                return jsend.success('Authorization code is valid');
            } else {
                const dateNow = Date.now();
                if (code.attempts.length == 2) {
                    code.tryAgainAt = addMinutes(dateNow);
                }
                code.attempts.push(dateNow);
                code.lastAttempt = dateNow;
                code.expires = dateNow;
                patient.documentationAuthorizationCode = code;
                console.log('about to update');
                patient = await _patientService.update(patient._id, patient, {});
                return jsend.fail('Invalid authorization code supplied');
            }

            // patient = await _patientService.update(patient._id, patient, {});
            // return Promise.resolve(patient);
        } else if (params.query.type === 'medical') {
            const _employeeService = this.app.service('employees');
            const employeeId = params.query.employeeId;
            let employee = await _employeeService.get(employeeId);
            const token = await _tokenService.get(
                tokenLabel.tokenType.facilityVerification, {});
            employee.documentationAuthorizationCode = {
                documentationAuthorizationCode: token.result,
                expires: addMinutes(
                    Date.now(), parseInt(process.env.DOCTORDOCUMENTATIONEXPIRESIN)),
                attempts: [],
            };
            employee = await _employeeService.update(employee._id, employee, {});
            return Promise.resolve(employee);
        }
    }


    async create(data, params) {
        const _tokenService = this.app.service('get-tokens');
        if (data.type === 'patient') {
            const _patientService = this.app.service('patients');
            const _employeeService = this.app.service('employees');
            const _facilityService = this.app.service('facilities');
            const patientId = data.patientId;
            const facilityId = data.facilityId;
            const employeeId = data.employeeId;
            let patient = await _patientService.get(patientId);
            const token = await _tokenService.get(
                tokenLabel.tokenType.facilityVerification, {});
            patient.documentationAuthorizationCode = {
                documentationAuthorizationCode: token.result,
                expires: addMinutes(
                    Date.now(), parseInt(process.env.PATIENTDOCUMENTATIONEXPIRESIN)),
                attempts: [],

            };
            patient = await _patientService.update(patient._id, patient, {});
            if (process.env.SENDSMS === 'true') {
                await sms.sendPatientDocumentAuthorization(
                    patient.personDetails, token.result);
            }
            return jsend.success('Authorization code sent to the patient');
        } else if (data.type === 'medical') {
            const _employeeService = this.app.service('employees');
            const employeeId = data.employeeId;
            let employee = await _employeeService.get(employeeId);
            const token = await _tokenService.get(
                tokenLabel.tokenType.facilityVerification, {});
            employee.documentationAuthorizationCode = {
                documentationAuthorizationCode: token.result,
                expires: addMinutes(
                    Date.now(), parseInt(process.env.DOCTORDOCUMENTATIONEXPIRESIN)),
                attempts: [],
            };
            employee = await _employeeService.update(employee._id, employee, {});
            return Promise.resolve(employee);
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