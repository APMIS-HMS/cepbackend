/* eslint-disable no-unused-vars */
const logger = require('winston');
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
        const channelNamesService = this.app.service('temporal-chanel-names');

        let channelNames = [];
        let channelObj = [];
        let consFilter = cons.filter(connect => connect.user._id.toString() === data.userId.toString());

        let loggedInConnection;
        let person = cons[0].user.email;
        const facilityId = data._id;
        const facilityName = data.facilityName;
        // let departmentChannel,unitChannel,workspace,personal;
        let dept = data.dept;

        //console.log('*******************************\n',dept);
        //const getAllChannels = await channelNamesService.find({ query: { facilityId: facilityId } });

        //let facilityChannels = getAllChannels.data[0];

        if (consFilter.length > 0) {
            loggedInConnection = consFilter[0];
            let channel = this.app.channel(facilityId);
            let authenticatedChannel = this.app.channel('authenticated');
            authenticatedChannel.leave(loggedInConnection);


            channel.join(loggedInConnection);

            dept.forEach(element => {
                //channelNames.push(element.name);
                let departmentChannel = this.app.channel(element.name);
                departmentChannel.join(loggedInConnection);
                channelObj.push({id:element._id,name:element.name});
                let units = element.units;
                if (units.length > 0) {
                    //Create Unit channel
                    units.forEach(unit => {
                        //channelNames.push(unit.name);
                        let unitChannel = this.app.channel(unit.name);
                        unitChannel.join(loggedInConnection);
                        channelObj.push({id:unit._id,name:unit.name});
                    });
                }
            });
            channelObj.push({id:data._id,name:data.facilityName});

            // Filter all proposed channels
            // if (facilityChannels.channels.length > 0) {
            //     dept.forEach(element => {
            //         //console.log('=========********************===============\n',element);
            //         channelNames.push(element.name);
            //         let departmentChannel = this.app.channel(element.name);
            //         departmentChannel.join(person);
            //         channelObj.push({id:element._id,name:element.name});
            //         let units = element.units;
            //         if (units.length > 0) {
            //             //Create Unit channel
            //             units.forEach(unit => {
            //                 channelNames.push(unit.name);
            //                 let unitChannel = this.app.channel(unit.name);
            //                 unitChannel.join(person);
            //                 channelObj.push({id:unit._id,name:unit.name});
            //             });
            //         }
            //     });
            // }

            //let newChannels = [];
            //let existingChannels = [];
            // let addChannelNames = {
            //     facilityId: facilityId,
            //     channels: []
            // };

            //Check if facility channels exist

            // if (facilityChannels !== undefined && facilityChannels.channels.length < channelNames.length) {
            //     console.log('************facilityChannels rooms***********\n', facilityChannels.channels.length);
            //     if (channelNames.length > 0) {
            //         let room = facilityChannels.channels;

            //         newChannels = room.filter(channel => !channelNames.includes(channel));
            //         console.log('************Unsaved roomsppppppppppp***********\n', newChannels);

            //     } else {
            //         //Return default channels just incase logged in user doesn't have a role 
            //         let result = this.app.channels;
            //         return Promise.resolve({ result });
            //     }
            //     if (newChannels.length > 0 && existingChannels.length !== 0) {
            //         console.log('******************Got to update block******************\n');
            //         addChannelNames.channels.push(newChannels);
            //         let updateChannels = await channelNamesService.update(data._id, { channels: addChannelNames }, {});
            //         console.log('******************updateChannels******************\n', updateChannels);
            //         //Create new channel instances
            //         newChannels.forEach(e => {
            //             let room = e + '' + data._id;
            //             console.log('*************************room**********************8', room);
            //             this.app.channel(room);
            //         });

            //         let allChannel;
            //         // Add user to all channels that concerns the user
            //         channelNames.forEach(e => {
            //             allChannel = this.app.channel(e);
            //             allChannel.join(person);
            //         });
            //     }//Check if existing
            //     else if (existingChannels.length === channelNames.length) {
            //         // Add user to all channels that concerns the user
            //         let allChannel;
            //         // Add user to all channels that concerns the user
            //         channelNames.forEach(e => {
            //             allChannel = this.app.channel(e);
            //             allChannel.join(person);
            //         });
            //     }
            // } else {
            //     console.log('******************Got to create block******************\n');
            //     addChannelNames.channels = channelNames;
            //     if (facilityId !== undefined) {
            //         console.log('******************addChannelNames******************\n', addChannelNames);
            //         let addChannels = await channelNamesService.create(addChannelNames);
                    
            //         let allChannel;
            //         // Add user to all channels that concerns the user
            //         channelNames.forEach(e => {
            //             allChannel = this.app.channel(e);
            //             allChannel.join(person);
            //         });
            //         console.log('******************addChannels******************\n', addChannels);
            //     }
            // }
        }

        let result = this.app.channels;
        console.log('******************addChannels******************\n', channelObj);
        console.log('\n******************result******************\n', result);
        return Promise.resolve({
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
        return Promise.resolve({ id });
    }
    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;