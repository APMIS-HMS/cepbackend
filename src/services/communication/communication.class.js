/* eslint-disable no-unused-vars */
const emailerTemplate = require('../../templates/emailer');
const emailLabel = require('../../parameters/email-label');
const smsLabel = require('../../parameters/sms-label');
const smsTemplate = require('../../templates/sms-sender');
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const messageService = this.app.service('message');
        //const chatService = this.app.service('chat');
        let con = this.app.channel('authenticated').connections;
        console.log('=====Got here=======\n',data);
        let user = con[0].user.personId;
                
        //if(Array.isArray(user.rooms)) user.rooms.forEach(room => this.app.channel(`rooms/${room.id}`).join(channel));

        let createMessage, createChat;
        let messageObj = {};
        let channelObj = {};
        //Initialise channel names
        channelObj.email = user.email;
        channelObj.id = user.personId;
        data.email = data.reciever;
        // Set message object
        messageObj.reciever = data.reciever;
        messageObj.sender = data.sender;
        messageObj.messageChannel = data.messageChannel;
        messageObj.facilityId = data.facilityId;
        messageObj.messageStatus = data.messageStatus;
        messageObj.message = data.message;
        //console.log('\n=====messageObj=======\n',messageObj);
        //console.log('=====Got =====here=======\n',data);
        
        try {
            if (data.messageChannel === 'email') {
                emailerTemplate.notification(data);
            } else if (data.messageChannel === 'sms'){
                smsTemplate.sendNotification(data);
            }
            else if(data.messageChannel === 'broadcast'){
                //console.log('======connection User========\n',con[0].user);
                let channel = data.facilityId;
                let con = this.app.channel(channel);
                con.send(data.message);
                createMessage = await messageService.create(messageObj);
                //console.log('\n createMessage: \n', createMessage);
            }
            else{
                let channel = this.app.channel(user);
                channel.send(data.message);
                createChat = await messageService.create(messageObj);
                console.log('\n createChat: \n', createChat);
            }
            let result = {};
            result.message = createMessage;
            result.chat = createChat;

            return jsend.success(result);
        } catch (error) {
            return jsend.error('Error found chat');
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

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
