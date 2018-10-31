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

    // let cons = this.app.channel('authenticated').connections;

    // let channelObj = [];
    // let consFilter = cons.filter(connect => connect.user._id.toString() === data.userId.toString());

    // let loggedInConnection;
    // const facilityId = data._id;
    // let dept = data.dept;

    // if (consFilter.length > 0 && dept !== undefined) {
    //   loggedInConnection = consFilter[0];
    //   let channel = this.app.channel(facilityId);


    //   channel.join(loggedInConnection);


    //   dept.forEach(element => {
    //     let departmentChannel = this.app.channel(element.name);
    //     departmentChannel.join(loggedInConnection);
    //     channelObj.push({
    //       id: element._id,
    //       name: element.name
    //     });
    //     let units = element.units;
    //     if (units.length > 0) {
    //       //Create Unit channel
    //       units.forEach(unit => {
    //         let unitChannel = this.app.channel(unit.name);
    //         unitChannel.join(loggedInConnection);
    //         channelObj.push({
    //           id: unit._id,
    //           name: unit.name
    //         });
    //       });
    //     }
    //   });
    //   channelObj.push({
    //     id: data._id,
    //     name: data.facilityName
    //   });
    //   channelObj.push({
    //     id: params.connection.user._id,
    //     name: params.connection.user.email
    //   })
    // }
    // console.log(channelObj);
    // return jsend.success(channelObj);

        let cons = this.app.channel('authenticated').connections;
        let consFilter = cons.filter(connect => connect.user._id.toString() === data.userId.toString());

        let loggedInConnection;
        let dept = data.dept;
        let channelObj = [];
        let userChannel = params.connection.user._id;

        if (consFilter.length > 0) {
            loggedInConnection = consFilter[0];
            let channel = this.app.channel(data._id);
            let authenticatedChannel = this.app.channel('authenticated');
            authenticatedChannel.leave(loggedInConnection);
            channel.join(loggedInConnection);
        }

        dept.forEach(element => {
            let departmentChannel = this.app.channel(element._id);
            departmentChannel.join(loggedInConnection);
            channelObj.push({
                id: element._id,
                name: element.name
            });
            let units = element.units;
            if (units.length > 0) {
                //Create Unit channel
                units.forEach(unit => {
                    let unitChannel = this.app.channel(unit._id);
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

        channelObj.push({
            id: params.connection.user._id,
            name: params.connection.user.email
        });

        // Create user channel
        this.app.channel(userChannel);
        
        let result = this.app.channels;
        return Promise.resolve({
            result,
            channelObj
        });
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
