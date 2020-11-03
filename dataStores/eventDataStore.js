const EventModel = require('../models/eventModel');

getAllEvents = async() => {
    const events = EventModel.find({})
        .populate({ path: 'memberAttendances',
            select: { timeIn: 1, timeOut: 1, _id: 1 },
        populate: { path: 'memberId', 
            select:{ name: 1, status: 1, _id: 1 }}});

    return events;
};

getEventById = async(eventId) => {
    const event = await EventModel.findOne({ _id: eventId })
        .populate({ path: 'memberAttendances',
            select: { timeIn: 1, timeOut: 1, _id: 1 },
        populate: { path: 'memberId', 
            select:{ name: 1, status: 1, _id: 1 }}});

    return event;
}

addEvent = async(event) => {
    const eventModel = new EventModel();

    Object.keys(event).forEach(propName => {
        eventModel[propName] = event[propName];
    });

    await eventModel.save();
};

updateEvent = async(eventId, event) => {
    await EventModel.findOneAndUpdate({ _id: eventId }, event);
};

searchEvents = async(searchParams) => {
    const events = await EventModel.find(searchParams)
    .populate({ path: 'memberAttendances',
        select: { timeIn: 1, timeOut: 1, _id: 1 },
    populate: { path: 'memberId', 
        select:{ name: 1, status: 1, _id: 1 }}});    

    return events;
}

deleteEvent = async(eventId) => {
    await EventModel.findOneAndDelete({ _id: eventId });
}

module.exports = { getAllEvents, getEventById, addEvent, updateEvent, searchEvents, deleteEvent };