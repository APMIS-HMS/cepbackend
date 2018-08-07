const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fistula_A = require('./fistula-item-a-model');
const fistula_B = require('./fistula-item-model');
const fistulaModelSchema = new Schema({
    A  : fistula_A,
    B : fistula_B
});
module.exports = fistulaModelSchema;
