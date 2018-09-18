// chat-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const chat = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        sender: { type: String, required: true },
        reciever: { type: String, required: true },
        message: { type: String, required: true },
        messageChannel:{type:String, required: true}
    }, {
        timestamps: true
    });

    return mongooseClient.model('chat', chat);
};
