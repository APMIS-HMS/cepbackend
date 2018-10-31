const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const A_Schema = require('./family-planning-A-model');
const B_Schema = require('./family-planning-B-model');
const familyPlanningModelSchema = new Schema({
    A  : A_Schema,
    B  : B_Schema
});
module.exports = familyPlanningModelSchema;