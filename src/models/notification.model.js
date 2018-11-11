// notification-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const notification = new Schema({
        facilityId: { type: String, required: true },
        isRead: {type:Boolean, 'default':false, required:false},
        title:{type:String, required:true},
        description:{type:String, required:false},
        receiverId:{type:String, required:false},
        senderId: {type:String,required:false}
    }, {
        timestamps: true
    });

    return mongooseClient.model('notification', notification);
};
