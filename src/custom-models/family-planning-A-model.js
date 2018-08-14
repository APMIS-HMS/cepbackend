const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const familyPlanningItemSchema = require('./family-planning-item-model');
const familyPlanningItemASchema = new Schema({
    Male  : familyPlanningItemSchema,
    Female  : familyPlanningItemSchema
});
module.exports = familyPlanningItemASchema;