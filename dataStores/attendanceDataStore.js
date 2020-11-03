const AttendanceModel = require('../models/attendanceModel');
const eventDataStore = require('../dataStores/eventDataStore');
const memberDataStore = require('../dataStores/memberDataStore');

getAllAttendances = async() => {
    const members = AttendanceModel.find({});
    return members;
};

getAttendanceById = async(attendanceId) => {
    const attendance = await AttendanceModel.findOne({ _id: attendanceId });

    return attendance;
}

addAttendance = async(attendance) => {
    const attendanceModel = new AttendanceModel();

    Object.keys(attendance).forEach(propName => {
        attendanceModel[propName] = attendance[propName];
    });

    const attendanceId = (await attendanceModel.save())._id;

    const event = await eventDataStore.getEventById(attendance.eventId);
    event.memberAttendances.push(attendanceId);
    await event.save();

    const member = await memberDataStore.getMemberById(attendance.memberId);
    member.eventAttendances.push(attendanceId);
    await member.save();
};

updateAttendance = async(attendanceId, attendance) => {
    await AttendanceModel.findOneAndUpdate({ _id: attendanceId }, attendance);
};

deleteAttendance = async(attendanceId) => {
    const attendance = await AttendanceModel.findOne({ _id: attendanceId });

    const event = await eventDataStore.getEventById(attendance.eventId);

    if(event != null) {
        let index = -1;

        const item = event.memberAttendances.find((element, i) => {
            if(element.Id.equals(attendance.Id)) {
                index = i;
            }

            return element.Id.equals(attendance.Id);
        });

        if(index != -1) {
            event.memberAttendances.splice(index, 1);
            await event.save();
        }
    }

    const member = await memberDataStore.getMemberById(attendance.memberId);

    if(member != null) {
        let index = -1;

        const item = member.eventAttendances.find((element, i) => {
            if(element.Id.equals(attendance.Id)) {
                index = i;
            }

            return element.Id.equals(attendance.Id);
        });

        if(index != -1) {
            member.eventAttendances.splice(index, 1);
            await member.save();
        }
    }

    await AttendanceModel.findOneAndDelete({ _id: attendanceId });
}

module.exports = { getAllAttendances, getAttendanceById, addAttendance, updateAttendance, deleteAttendance };
