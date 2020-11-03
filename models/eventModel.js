const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { 
  toJSON: { 
    virtuals: true, transform: function(doc, ret) {
        delete ret._id; 
        delete ret.__v; 
        delete ret.id; 
        delete ret.memberAttendances;
    } 
  } 
};

const eventSchema = new Schema({
    eventName: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    memberAttendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }]
  }, options);

  eventSchema.virtual('Id').get(function() {
    return this._id;
  });

  eventSchema.virtual('memberAttendance').get(function() {
    const attendances = [];

    if(this.memberAttendances != undefined) {
      this.memberAttendances.forEach(element => {
        attendances.push({
          memberId: element.memberId.Id,
          name: element.memberId.name,
          timeIn: element.timeIn,
          timeOut: element.timeOut
        });
      });  
    }

    return attendances;
  });

  const EventModel = mongoose.model('Event', eventSchema);
  
  module.exports = EventModel;