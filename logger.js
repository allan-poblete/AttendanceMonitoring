const events = require('events');
const fs = require('fs');

const logger = new events.EventEmitter();

const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1;

if(month < 10) {
    month = `0${month}`;
}

let day = date.getDate();

if(day < 10) {
    day = `0${day}`;
}

const fileName = `${year}-${month}-${day}`;

logger.on('getAllEvents', () => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`getAllEvents called\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('getEventById', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`getEventById called: ${data}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('addEvent', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`addEvent called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('updateEvent', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`updateEvent called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('searchEvent', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`searchEvent called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('exportEvent', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`exportEvent called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('deleteEvent', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`deleteEvent called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('getAllMembers', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`getAllMembers called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('searchMember', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`searchMember called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('addMember', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`addMember called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('updateMember', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`updateMember called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('deleteMember', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`deleteMember called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('getAllAttendances', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`getAllAttendances called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('getAttendanceById', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`getAttendanceById called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('addAttendance', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`addAttendance called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('updateAttendance', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`updateAttendance called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

logger.on('deleteAttendance', (data) => {
    var stream = fs.createWriteStream(`./logs/AttendanceMonitoringLogs-${fileName}.txt`, {flags:'a'});

    stream.write(`deleteAttendance called: ${JSON.stringify(data)}\n`, (err) => {
        if(err) {
            console.log(err);
        }
    })
});

module.exports = logger;