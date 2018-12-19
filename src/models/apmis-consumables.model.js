// apmis-consumables-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const apmisConsumables = new Schema({
    RXCUI: { type: String, required: false },
    LAT: { type: String, required: false, 'default': 'ENG' },
    TS: { type: String, required: false, 'default': '' },
    LUI: { type: String, required: false, 'default': '' },
    STT: { type: String, required: false, 'default': '' },
    SUI: { type: String, required: false, 'default': '' },
    ISPREF: { type: String, required: false, 'default': '' },
    RXAUI: { type: String, required: false, 'default': '' },
    SAUI: { type: String, required: false, 'default': '' },
    SCUI: { type: String, required: false, 'default': '' },
    SDUI: { type: String, required: false, 'default': '' },
    SAB: { type: String, required: false, 'default': 'NIG' },
    TTY: { type: String, required: false, 'default': '' },
    CODE: { type: String, required: false, 'default': '' },
    STR: { type: String, required: false, 'default': '' },
    SRL: { type: String, required: false, 'default': '' },
    SUPPRESS: { type: String, required: false, 'default': '' },
    CVF: { type: String, required: false, 'default': '' },
    MAT: { type: String, required: false }, //Product Manufacturer
    URL: { type: String, required: false }, //Product Brand Image URL
    REGIMENS: [{ type: Schema.Types.Mixed, required: false }] ,//Product Regimen
    CONSUMABLECATEGORYID: { type: Schema.Types.ObjectId, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('apmis-Consumables', apmisConsumables);
};
