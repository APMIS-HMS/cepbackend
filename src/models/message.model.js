// message-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const message = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: [true,'Facility is undefined or invalid'] },
        sender: { type: String, required: [true,'Sender field must not be empty'] },
        reciever: { type: String, required: [true,'Reciever field must not be empty'] },
        message: { type: String, required: [true,'Message is must be defined'] },
        messageChannel:{type:String, required: false},
        messageStatus:{type:String, required:false},
        channel:{type:String, required:false}
    }, {
        timestamps: true
    });

    return mongooseClient.model('message', message);
};
