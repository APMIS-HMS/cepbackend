const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceGenderSchema = require('./facility-attendance-gender-model');

const faciltyAttendanceSchema = new Schema({
  Male: attendanceGenderSchema,
  Female: attendanceGenderSchema,
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = faciltyAttendanceSchema;
