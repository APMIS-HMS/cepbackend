const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const under5DeathsItemModelSchema = new Schema({
    dths_diarrhoea_under5  : { type: Number, required: false, 'default': 0 },
    dths_malaria_under5  : { type: Number, required: false, 'default': 0 },
    dths_pneumonia : { type: Number, required: false, 'default': 0 },
    dths_malnutrition : { type: Number, required: false, 'default': 0 },
    dths_others_under5 : { type: Number, required: false, 'default': 0 }
});
module.exports = under5DeathsItemModelSchema;