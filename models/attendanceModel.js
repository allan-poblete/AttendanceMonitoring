const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { 
    toJSON: { 
      virtuals: true, transform: function(doc, ret) {
          delete ret._id; 
          delete ret.__v;
          delete ret.id; 
      } 
    } 
  };

  const attendanceSchema = new Schema({
    timeIn: {
      type: Date,
      required: true
    },
    timeOut: {
        type: Date,
        required: false
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true
    }
  }, options);

  attendanceSchema.virtual('Id').get(function() {
    return this._id;
  });

  const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
  
  module.exports = AttendanceModel;