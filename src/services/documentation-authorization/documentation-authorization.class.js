/* eslint-disable no-unused-vars */
const tokenLabel = require('../../parameters/token-label');
var isToday = require('date-fns/is_today');
var addMinutes = require('date-fns/add_minutes');
var isFuture = require('date-fns/is_future');
var parse = require('date-fns/parse');
const jsend = require('jsend');
const sms = require('../../templates/sms-sender');
const emailer = require('../../templates/emailer');
var AES = require('crypto-js/aes');
var CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    if (params.query.type === 'patient') {
      const _patientService = this.app.service('patients');
      const patientId = params.query.patientId;
      const employeeId = params.query.employeeId;
      const facilityId = params.query.facilityId;
      const password = params.query.password;
      let patient = await _patientService.get(patientId);
      const token = params.query.token;
      const code = patient.documentationAuthorizationCode;
      if (code.attempts.length > 2 && isFuture(parse(code.tryAgainAt))) {
        return jsend.fail('Please attempt back in ' + code.tryAgainAt);
      } else if (
        code.documentationAuthorizationCode === token &&
        code.employeeId.toString() == employeeId.toString() &&
        code.facilityId.toString() == facilityId.toString()) {
        if (isFuture(parse(code.expires))) {
          // get user object
          const userService = this.app.service('users');
          const user = await userService.get(params.user._id);

          // decrypt password
          var password_bytes = AES.decrypt(password, 'endurance@pays@alot');
          let passwordText = password_bytes.toString(CryptoJS.enc.Utf8);


          // compare password
          const comparePassword =
            await bcrypt.compare(passwordText, user.password);
          if (comparePassword == true) {
            code.attempts = [];
            code.verified = true;
            patient.documentationAuthorizationCode = code;
            patient = await _patientService.update(patient._id, patient, {});

            const msg = {
              text: 'Authorization code is valid',
              expires: patient.documentationAuthorizationCode.expires,
              patientId: patientId
            };
            return jsend.success(msg);
          } else {
            return jsend.fail(
              'Invalid authorization code or password supplied');
          }
        } else {
          return jsend.fail(
            'Expired authorization code or invalid password supplied');
        }
      } else {
        const dateNow = Date.now();
        if (code.attempts.length == 2) {
          code.tryAgainAt = addMinutes(dateNow, 30);
        }
        code.attempts.push(dateNow);
        code.lastAttempt = dateNow;
        code.expires = dateNow;
        code.employeeId = employeeId;
        code.facilityId = facilityId;
        patient.documentationAuthorizationCode = code;

        patient = await _patientService.update(patient._id, patient, {});
        return jsend.fail('Invalid authorization code supplied');
      }
    } else if (params.query.type === 'medical') {
      const _employeeService = this.app.service('employees');
      const employeeId = params.query.employeeId;
      const facilityId = params.query.facilityId;
      let employee = await _employeeService.get(employeeId);
      const password = params.query.password;

      const token = params.query.token;
      const code = employee.documentationAuthorizationCode;
      if (code.attempts.length > 2 && isFuture(parse(code.tryAgainAt))) {
        return jsend.fail('Please attempt back in ' + code.tryAgainAt);
      } else if (
        code.documentationAuthorizationCode === token &&
        code.employeeId.toString() == employeeId.toString() &&
        code.facilityId.toString() == facilityId.toString()) {
        if (isFuture(parse(code.expires))) {
          // get user object
          const userService = this.app.service('users');
          const user = await userService.get(params.user._id);

          // decrypt password
          var password_bytes = AES.decrypt(password, 'endurance@pays@alot');
          let passwordText = password_bytes.toString(CryptoJS.enc.Utf8);


          // compare password
          const comparePassword =
            await bcrypt.compare(passwordText, user.password);
          if (comparePassword == true) {
            code.attempts = [];
            code.verified = true;
            employee.documentationAuthorizationCode = code;
            employee =
              await _employeeService.update(employee._id, employee, {});

            const msg = {
              text: 'Authorization code is valid',
              expires: employee.documentationAuthorizationCode.expires,
              employeeId: employeeId
            };
            return jsend.success(msg);
          } else {
            return jsend.fail(
              'Invalid authorization code or password supplied');
          }
        } else {
          return jsend.fail(
            'Expired authorization code or invalid password supplied');
        }
      } else {
        const dateNow = Date.now();
        if (code.attempts.length == 2) {
          code.tryAgainAt = addMinutes(dateNow, 30);
        }
        code.attempts.push(dateNow);
        code.lastAttempt = dateNow;
        code.expires = dateNow;
        code.employeeId = employeeId;
        code.facilityId = facilityId;
        employee.documentationAuthorizationCode = code;

        employee = await _employeeService.update(employee._id, employee, {});
        return jsend.fail('Invalid authorization code supplied');
      }
    }
  }


  async create(data, params) {
    const _tokenService = this.app.service('get-tokens');
    if (data.type === 'patient') {
      const _patientService = this.app.service('patients');
      const patientId = data.patientId;
      const facilityId = data.facilityId;
      const employeeId = data.employeeId;
      let patient = await _patientService.get(patientId);
      const code = patient.documentationAuthorizationCode;
      if (code.employeeId.toString() == employeeId.toString() &&
        code.facilityId.toString() == facilityId.toString() &&
        isFuture(parse(code.expires))) {
        if (code.verified == true) {
          const msg = {
            text: 'Authorization code is valid',
            expires: patient.documentationAuthorizationCode.expires,
            patientId: patientId,
            stillValid: true
          };
          return jsend.success(msg);
        } else {
          return jsend.fail('Code has not been verified');
        }
      } else {
        const token = await _tokenService.get(
          tokenLabel.tokenType.facilityVerification, {});
        patient.documentationAuthorizationCode = {
          documentationAuthorizationCode: token.result,
          expires: addMinutes(
            Date.now(), parseInt(process.env.PATIENTDOCUMENTATIONEXPIRESIN)),
          attempts: [],
          employeeId: employeeId,
          facilityId: facilityId

        };
        patient = await _patientService.update(patient._id, patient, {});
        if (process.env.SENDSMS === 'true') {
          await sms.sendPatientDocumentAuthorization(
            patient.personDetails, token.result);
            if (patient.personDetails.email !== undefined) {
              await emailer.sendPatientDocumentAuthorization(patient.personDetails, token.result);
            }
        }

        return jsend.success('Authorization code sent to the patient');
      }

    } else if (data.type === 'medical') {
      const _employeeService = this.app.service('employees');
      const employeeId = data.employeeId;
      const facilityId = data.facilityId;
      let employee = await _employeeService.get(employeeId);


      const code = employee.documentationAuthorizationCode;
      if (code !== undefined &&
        code.employeeId.toString() == employeeId.toString() &&
        code.facilityId.toString() == facilityId.toString() &&
        isFuture(parse(code.expires))) {
        if (code.verified == true) {
          const msg = {
            text: 'Authorization code is valid',
            expires: employee.documentationAuthorizationCode.expires,
            employeeId: employeeId,
            stillValid: true
          };
          return jsend.success(msg);
        } else {
          return jsend.fail('Code has not been verified');
        }
      } else {
        const token = await _tokenService.get(
          tokenLabel.tokenType.facilityVerification, {});
        employee.documentationAuthorizationCode = {
          documentationAuthorizationCode: token.result,
          expires: addMinutes(
            Date.now(), parseInt(process.env.DOCTORDOCUMENTATIONEXPIRESIN)),
          attempts: [],
          employeeId: employeeId,
          facilityId: facilityId

        };
        employee = await _employeeService.update(employee._id, employee, {});
        if (process.env.SENDSMS === 'true') {
          await sms.sendPatientDocumentAuthorization(
            employee.personDetails, token.result);
        }
        return jsend.success('Authorization code sent to the doctor');
      }
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
