const attendanceDataStore = require('../dataStores/attendanceDataStore');
const eventDataStore = require('../dataStores/eventDataStore');
const memberDataStore = require('../dataStores/memberDataStore');
const logger = require('../logger');
const ObjectID = require("mongodb").ObjectID;

exports.getAllAttendances = async (req, res) => {
    logger.emit('getAllAttendances');

    const attendances = await attendanceDataStore.getAllAttendances();
    res.send(attendances);
};

exports.getAttendanceByIdValidator = async (req, res, next) => {
    const attendanceId = req.params.Id;

    logger.emit('getAttendanceById', attendanceId);

    if(!ObjectID.isValid(attendanceId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${attendanceId}' is not a valid ObjectId` }));
        return;
    }

    next();
}

exports.getAttendanceById = async (req, res) => {
    const attendanceId = req.params.Id;
    const attendance = await attendanceDataStore.getAttendanceById(attendanceId);

    if (attendance == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Internal Error": `Attendance with Id ${attendanceId} not found` }));
        return;
    }
    else {
        res.send(attendance);
    }
}

exports.addAttendanceValidator = async (req, res, next) => {
    const bodyProps = Object.keys(req.body);

    logger.emit('addAttendance', req.body);

    if(!bodyProps.includes('eventId') || req.body.eventId == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'eventId' is required" }));        
        return;
    }

    const eventId = req.body.eventId;

    if(!ObjectID.isValid(eventId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${eventId}' is not a valid ObjectId` }));
        return;
    }

    const event = await eventDataStore.getEventById(eventId);

    if (event == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Internal Error": `Event with eventId ${eventId} not found` }));
        return;
    }

    if(!bodyProps.includes('memberId') || req.body.memberId == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'memberId' is required" }));        
        return;
    }

    const memberId = req.body.memberId;

    if(!ObjectID.isValid(memberId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${memberId}' is not a valid ObjectId` }));
        return;
    }

    const member = await memberDataStore.getMemberById(memberId);

    if (member == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Internal Error": `Member with memberId ${memberId} not found` }));
        return;
    }

    if(!bodyProps.includes('timeIn') || req.body.timeIn == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'timeIn' is required" }));        
        return;
    }

    if(!isValidDate(req.body.timeIn)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'timeIn'" }));        
        return;
    }

    if(req.body.timeOut != null && !isValidDate(req.body.timeOut)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'timeOut'" }));        
        return;
    }

    if(req.body.timeOut != null && Date.parse(req.body.timeIn) > Date.parse(req.body.timeOut)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'timeIn' must be less than 'timeOut'" }));        
        return;
    }

    next();    
};

function isValidDate(dateString) {
    const date = Date.parse(dateString);

    return !isNaN(date);
  }

exports.addAttendance = async (req, res) => {
    const attendance = req.body;

    await attendanceDataStore.addAttendance(attendance);

    res.status(200).send('Created');
};

exports.updateAttendanceValidator = async (req, res, next) => {
    logger.emit('updateAttendance', req.body);

    const attendanceId = req.body.Id;

    if(!attendanceId || (attendanceId != null && attendanceId == "")) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'Id' is required" }));         
        return;
    }

    if(!ObjectID.isValid(attendanceId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${attendanceId}' is not a valid ObjectId` }));
        return;
    }

    const attendance = await attendanceDataStore.getAttendanceById(attendanceId);

    if(attendance == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Attendance with Id ${attendanceId} does not exist` }));
        return;
    }

    if(req.body.timeIn != null && (req.body.timeIn == "" || !isValidDate(req.body.timeIn))) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'timeIn'" }));         
        return;
    }

    if(req.body.timeOut != null && !isValidDate(req.body.timeOut)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'timeOut'" }));         
        return;
    }

    if(req.body.timeOut != null && Date.parse(req.body.timeIn) > Date.parse(req.body.timeOut)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'timeIn' must be less than 'timeOut'" }));         
        return;
    }

    const timeIn = Date.parse(req.body.timeIn);

    if(timeIn >= attendance.timeOut) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Saving this record will have 'timeIn' greater than or equal to 'timeOut'" }));        
        return;
    }

    if(req.body.timeOut != null) {
        const timeOut = Date.parse(req.body.timeOut);

        if(attendance.timeIn >= timeOut) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({ "Validation Error": "Saving this record will have 'timeOut' less than or equal to 'timeIn'" }));        
            return;
        }
    }

    next();
};

exports.updateAttendance = async (req, res) => {
    const attendanceId = req.body.Id;
    const timeIn = req.body.timeIn;
    const timeOut = req.body.timeOut;

    const attendance = await attendanceDataStore.getAttendanceById(attendanceId);

    if(timeIn) {
        attendance.timeIn = timeIn;
    }

    if(timeOut) {
        attendance.timeOut = timeOut;
    }

    await attendanceDataStore.updateAttendance(attendanceId, attendance);

    res.status(200).send('Updated');
};

exports.deleteAttendanceValidator = async (req, res, next) => {
    logger.emit('deleteAttendance', req.body);

    const attendanceId = req.body.Id;

    if(!attendanceId) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": `'Id' is required` }));
        return;
    }

    if(!ObjectID.isValid(attendanceId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${attendanceId}' is not a valid ObjectId` }));
        return;
    }

    const attendance = await attendanceDataStore.getAttendanceById(attendanceId);

    if(!attendance) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Attendance with Id ${attendanceId} does not exist` }));
        return;
    }

    next();
}

exports.deleteAttendance = async (req, res) => {
    const attendanceId = req.body.Id;

    await attendanceDataStore.deleteAttendance(attendanceId);

    res.status(200).send('Deleted');
};