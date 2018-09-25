/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        let drugInteractionUri = 'https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=' + params.query.rxcuis.join('+');
        const options = {
            method: 'GET',
            uri: drugInteractionUri
        };
        try {
            if (params.query.rxcuis !== undefined) {
                let interactions = await request(options);
                let parsed = JSON.parse(interactions);
                return jsend.success(parsed.fullInteractionTypeGroup);
            } else {
                return jsend.success({});
            }
        } catch (e) {
            return jsend.fail({});
        }
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;