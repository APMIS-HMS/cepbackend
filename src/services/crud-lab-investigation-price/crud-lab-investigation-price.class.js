/* eslint-disable no-unused-vars */
'use strict';
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
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
        const investigationService = this.app.service('investigations');
        const facilityPriceService = this.app.service('facility-prices');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const investigation = data.investigation;
        const facilityPrice = data.facilityServicePrice;

        if (accessToken !== undefined) {
            const hasFacility = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (hasFacility.length > 0) {
                // Update investigation
                try {
                    const updateInvestigation = await investigationService.patch(investigation._id, investigation, {});
                    if (updateInvestigation._id !== undefined) {
                        // Update the price too
                        try {
                            const updateFacilityPrice = await facilityPriceService.patch(facilityPrice._id, facilityPrice, {});
                            if (updateFacilityPrice._id !== undefined) {
                                const payload = {
                                    investigation: updateInvestigation,
                                    facilityPrice: updateFacilityPrice
                                };
                                return jsend.success(payload);
                            }
                        } catch (e) {
                            return jsend.error('There was a problem updating facility price.');
                        }
                    } else {
                        return jsend.error('There was problem updating investigation');
                    }
                } catch (e) {
                    return jsend.error('There was problem updating investigation');
                }
            } else {
                return jsend.error('Sorry! But you can not perform this transaction.');
            }
        } else {
            return jsend.error('Sorry! But you can not perform this transaction.');
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
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;