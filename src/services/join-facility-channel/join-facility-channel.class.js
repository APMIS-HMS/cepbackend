/* eslint-disable no-unused-vars */
const logger = require('winston');
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        let result = this.app.channels;
        return Promise.resolve(result);
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {

        let cons = this.app.channel('authenticated').connections;

        let channelObj = [];
        let consFilter = cons.filter(connect => connect.user._id.toString() === data.userId.toString());

        let loggedInConnection;
        //let person = cons[0].user.email;
        const facilityId = data._id;
        //const facilityName = data.facilityName;
        // let departmentChannel,unitChannel,workspace,personal;
        let dept = data.dept;

        if (consFilter.length > 0 && dept !== undefined) {
            loggedInConnection = consFilter[0];
            let channel = this.app.channel(facilityId);
            // let authenticatedChannel = this.app.channel('authenticated');
            //authenticatedChannel.leave(loggedInConnection);


            channel.join(loggedInConnection);

            
            dept.forEach(element => {
                //channelNames.push(element.name);
                let departmentChannel = this.app.channel(element.name);
                departmentChannel.join(loggedInConnection);
                channelObj.push({
                    id: element._id,
                    name: element.name
                });
                let units = element.units;
                if (units.length > 0) {
                    //Create Unit channel
                    units.forEach(unit => {
                        //channelNames.push(unit.name);
                        let unitChannel = this.app.channel(unit.name);
                        unitChannel.join(loggedInConnection);
                        channelObj.push({
                            id: unit._id,
                            name: unit.name
                        });
                    });
                }
            });
            channelObj.push({
                id: data._id,
                name: data.facilityName
            });
        }
        //let result = this.app.channels;
        return jsend.success(channelObj);
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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;