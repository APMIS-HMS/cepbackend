const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faciltyAttendanceBSchema = new Schema({
    Outpatient_Attendance : { type: Number, required: false,'default': 0 },
});
module.exports = faciltyAttendanceBSchema;
