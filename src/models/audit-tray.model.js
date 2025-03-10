// audit_tray-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const {
        Schema
    } = mongooseClient;
    const auditTray = new Schema({
        facility: {
            type: Schema.Types.Mixed,
            required: true
        },
        user: {
            type: Schema.Types.Mixed,
            required: true
        },
        action: {
            type: Schema.Types.Mixed,
            required: true
        },
        clientMachine: {
            type: Schema.Types.Mixed,
            required: false
        },
        networkInfo: {
            type: Schema.Types.Mixed,
            required: false
        },
        geolocation: {
            type: Schema.Types.Mixed,
            required: false
        },
        createdAt: {
            type: Date,
            'default': Date.now
        },
        updatedAt: {
            type: Date,
            'default': Date.now
        }
    }, {
        timestamps: true
    });

    return mongooseClient.model('auditTray', auditTray);
};
