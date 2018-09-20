/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        let drugInteractionUri = 'https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=' + params.query.rxcui;
        const options = {
            method: 'GET',
            uri: drugInteractionUri
        };
        try {
            if (params.query.rxcui !== undefined) {
                let interactions = await request(options);
                let parsed = JSON.parse(interactions);
                return jsend.success(parsed.interactionTypeGroup);
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