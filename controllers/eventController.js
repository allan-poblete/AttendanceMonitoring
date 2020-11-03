const dataStore = require('../dataStores/eventDataStore');
const logger = require('../logger');
const exportData = require('../exportData');
const ObjectID = require("mongodb").ObjectID;

exports.getAllEvents = async (req, res) => {
    logger.emit('getAllEvents');

    const events = await dataStore.getAllEvents();
    res.send(events);
};

exports.getEventByIdValidator = async (req, res, next) => {
    const eventId = req.params.Id;

    logger.emit('getEventById', eventId);

    if(!ObjectID.isValid(eventId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${eventId}' is not a valid ObjectId` }));
        return;
    }

    next();
}

exports.getEventById = async (req, res) => {
    const eventId = req.params.Id;
    const event = await dataStore.getEventById(eventId);

    if (event == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Internal Error": `Event with eventId ${eventId} not found` }));
        return;
    }
    else {
        res.send(event);
    }
}

exports.searchEventValidator = async (req, res, next) => {
    logger.emit('searchEvent', req.query);

    const eventname = req.query.eventname;
    const datestart = req.query.datestart;
    const dateend = req.query.dateend;

    if(eventname == undefined && datestart == undefined && dateend == undefined) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `You must specify one of the following: 'eventname', 'datestart', 'dateend'` }));
        return;
    }

    if(datestart == undefined && dateend == undefined && eventname == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `You must specify one of the following: 'eventname', 'datestart', 'dateend'` }));
        return;
    }

    if(datestart != undefined && !isValidDate(datestart)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'datestart'" }));        
        return;
    }

    if(dateend != undefined && !isValidDate(dateend)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'dateend'" }));        
        return;
    }

    next();
};

exports.searchEvent = async (req, res) => {
    const eventname = req.query.eventname;
    const datestart = req.query.datestart;
    const dateend = req.query.dateend;

    let searchParams = {};

    if(eventname != undefined) {
        searchParams['eventName'] = eventname;
    }

    if(datestart != undefined) {
        searchParams['datestart'] = datestart;
    }

    if(dateend != undefined) {
        searchParams['dateend'] = dateend;
    }

    const events = await dataStore.searchEvents(searchParams);

    res.send(events);
};

exports.addEventValidator = async (req, res, next) => {
    const bodyProps = Object.keys(req.body);

    logger.emit('addEvent', req.body);

    if(!bodyProps.includes('eventName') || req.body.eventName == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'eventName' is required" }));        
        return;
    }

    if(!bodyProps.includes('eventType') || req.body.eventType == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'eventType' is required" }));        
        return;
    }

    if(!bodyProps.includes('startDateTime') || req.body.startDateTime == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'startDateTime' is required" }));        
        return;
    }

    if(!isValidDate(req.body.startDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'startDateTime'" }));        
        return;
    }

    if(!bodyProps.includes('endDateTime') || req.body.endDateTime == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'endDateTime' is required" }));        
        return;
    }

    if(!isValidDate(req.body.endDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'endDateTime'" }));        
        return;
    }

    if(Date.parse(req.body.startDateTime) > Date.parse(req.body.endDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'startDateTime' must be less than or equal to 'endDateTime'" }));        
        return;
    }

    next();    
};

function isValidDate(dateString) {
    const date = Date.parse(dateString);

    return !isNaN(date);
  }

exports.addEvent = async (req, res) => {
    const event = req.body;

    await dataStore.addEvent(event);

    res.status(200).send('Created');
};

exports.updateEventValidator = async (req, res, next) => {
    logger.emit('updateEvent', req.body);

    const eventId = req.body.Id;

    if(!eventId || (eventId != null && eventId == "")) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'Id' is required" }));         
        return;
    }

    if(!ObjectID.isValid(eventId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${eventId}' is not a valid ObjectId` }));
        return;
    }

    const event = await dataStore.getEventById(eventId);

    if(event == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Event with Id ${eventId} does not exist` }));
        return;
    }

    if(req.body.eventName != null && req.body.eventName == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'eventName' cannot be blank" }));         
        return;
    }

    if(req.body.eventType != null && req.body.eventType == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'eventType' cannot be blank" }));         
        return;
    }

    if(req.body.startDateTime != null && !isValidDate(req.body.startDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'startDateTime'" }));         
        return;
    }

    if(req.body.endDateTime != null && !isValidDate(req.body.endDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'endDateTime'" }));         
        return;
    }

    if(req.body.startDateTime != null && req.body.endDateTime != null && Date.parse(req.body.startDateTime) > Date.parse(req.body.endDateTime)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'startDateTime' must be less than or equal to 'endDateTime'" }));        
        return;
    }

    if(req.body.startDateTime != null) {
        const startDateTime = Date.parse(req.body.startDateTime);

        if(startDateTime > event.endDateTime) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({ "Validation Error": "Saving this record will have 'startDateTime' greater than 'endDateTime'" }));        
            return;
        }
    }

    if(req.body.endDateTime != null) {
        const endDateTime = Date.parse(req.body.endDateTime);

        if(event.startDateTime > endDateTime) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({ "Validation Error": "Saving this record will have 'endDateTime' less 'startDateTime'" }));        
            return;
        }
    }

    next();
};

exports.updateEvent = async (req, res) => {
    const eventId = req.body.Id;
    const eventName = req.body.eventName;
    const eventType = req.body.eventType;
    const startDateTime = req.body.startDateTime;
    const endDateTime = req.body.endDateTime;

    const event = await dataStore.getEventById(eventId);

    if(eventName) {
        event.eventName = eventName;
    }

    if(eventType) {
        event.eventType = eventType;
    }

    if(startDateTime) {
        event.startDateTime = startDateTime;
    }

    if(endDateTime) {
        event.endDateTime = endDateTime;
    }

    await dataStore.updateEvent(eventId, event);

    res.status(200).send('Updated');
};

exports.exportEventValidator = async(req, res, next) => {
    logger.emit('exportEvent', req.query);

    const eventId = req.query.Id;

    if(eventId == null || eventId == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'Id' is required" }));         
        return;
    }

    const event = await dataStore.getEventById(eventId);

    if(event == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Event with Id ${eventId} does not exist` }));
        return;
    }

    next();
};

exports.exportEvent = async (req, res) => {
    const eventId = req.query.Id;

    const event = await dataStore.getEventById(eventId);

    const result = await exportData.export(event);

    if(result.hasError) {
        res.status(400).send(result.message);
    } else {
        res.status(200).send(`Event with Id '${eventId}' exported to file '${result.message}'`);
    }
};

exports.deleteEventValidator = async (req, res, next) => {
    logger.emit('deleteEvent', req.body);

    const eventId = req.body.Id;

    if(!eventId) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": `'eventId' is required` }));
        return;
    }

    if(!ObjectID.isValid(eventId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${eventId}' is not a valid ObjectId` }));
        return;
    }

    const event = await dataStore.getEventById(eventId);

    if(!event) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Event with Id ${eventId} does not exist` }));
        return;
    }

    if(event.memberAttendances.length != 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Cannot delete event with associated attendances` }));
        return;
    }

    next();
}

exports.deleteEvent = async (req, res) => {
    const eventId = req.body.Id;

    await dataStore.deleteEvent(eventId);

    res.status(200).send('Deleted');
};