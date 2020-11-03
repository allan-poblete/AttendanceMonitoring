const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { 
    toJSON: { 
      virtuals: true, transform: function(doc, ret) {
          delete ret._id; 
          delete ret.__v; 
          delete ret.id; 
          delete ret.eventAttendances;
      } 
    } 
  };

  const memberSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    joinedDate: {
      type: Date,
      required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true
    },
    eventAttendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }]
  }, options);

  memberSchema.virtual('Id').get(function() {
    return this._id;
  });

  memberSchema.virtual('eventAttendance').get(function() {
    const events = [];

    if(this.eventAttendances != undefined) {
      this.eventAttendances.forEach(element => {
        events.push({
          eventName: element.eventId.eventName,
          timeIn: element.timeIn,
          timeOut: element.timeOut
        });
      });  
    }

    return events;
  });

  const MemberModel = mongoose.model('Member', memberSchema);
  
  module.exports = MemberModel;