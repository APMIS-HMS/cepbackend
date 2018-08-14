const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceASchema = require('./facility-attendance-A-model');
const attendanceBSchema = require('./facility-attendance-B-model');

const faciltyAttendanceSchema = new Schema({
  A: attendanceASchema,
  B: attendanceBSchema
});
module.exports = faciltyAttendanceSchema;