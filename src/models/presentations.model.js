// presentation-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const presentations = new Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now },
    isActive: { type: Boolean, 'default': true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('presentations', presentations);
};
