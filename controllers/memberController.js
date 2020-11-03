const dataStore = require('../dataStores/memberDataStore');
const logger = require('../logger');
const ObjectID = require("mongodb").ObjectID;

exports.getAllMembers = async (req, res) => {
    logger.emit('getAllMembers');

    const members = await dataStore.getAllMembers();
    res.send(members);
};

exports.getMemberByIdValidator = async (req, res, next) => {
    const memberId = req.params.Id;

    logger.emit('getEventById', memberId);

    if(!ObjectID.isValid(memberId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${memberId}' is not a valid ObjectId` }));
        return;
    }

    next();
}

exports.getMemberById = async (req, res) => {
    const memberId = req.params.Id;

    if(!ObjectID.isValid(memberId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${memberId}' is not a valid ObjectId` }));
        return;
    }

    const member = await dataStore.getMemberById(memberId);

    if (memberId == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Internal Error": `Member with memberId ${memberId} not found` }));
        return;
    }
    else {
        res.send(member);
    }
}

exports.addMemberValidator = async (req, res, next) => {
    const bodyProps = Object.keys(req.body);

    logger.emit('addMember', req.body);

    if(!bodyProps.includes('name') || req.body.name == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'name' is required" }));        
        return;
    }

    if(req.body.joinedDate != null && !isValidDate(req.body.joinedDate)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'joinedDate'" }));        
        return;
    }

    if(!bodyProps.includes('status') || req.body.status == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'status' is required" }));        
        return;
    }

    if(req.body.status != "Active" && req.body.status != "Inactive") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'status' should either be 'Active' or 'Inactive'" }));        
        return;
    }

    next();    
};

function isValidDate(dateString) {
    const date = Date.parse(dateString);

    return !isNaN(date);
  }

exports.addMember = async (req, res) => {
    const member = req.body;

    await dataStore.addMember(member);

    res.status(200).send('Created');
};

exports.updateMemberValidator = async (req, res, next) => {
    logger.emit('updateMember', req.body);

    const memberId = req.body.Id;

    if(!memberId || (memberId != null && memberId == "")) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'Id' is required" }));         
        return;
    }

    if(!ObjectID.isValid(memberId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${memberId}' is not a valid ObjectId` }));
        return;
    }

    const member = await dataStore.getMemberById(memberId);

    if(member == null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Member with Id ${memberId} does not exist` }));
        return;
    }

    if(req.body.name != null && req.body.name == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'name' cannot be blank" }));         
        return;
    }

    if(req.body.joinedDate != null && !isValidDate(req.body.joinedDate)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "Invalid date format for 'joinedDate'" }));         
        return;
    }

    if(req.body.status != null && req.body.status == "") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": "'status' cannot be blank" }));         
        return;
    }

    next();
};

exports.updateMember = async (req, res) => {
    const memberId = req.body.Id;
    const name = req.body.name;
    const joinedDate = req.body.joinedDate;
    const status = req.body.status;

    const member = await dataStore.getMemberById(memberId);

    if(name) {
        member.name = name;
    }

    if(joinedDate) {
        member.joinedDate = joinedDate;
    }

    if(status) {
        member.status = status;
    }

    dataStore.updateMember(memberId, member);

    res.status(200).send('Updated');
};  

exports.deleteMemberValidator = async (req, res, next) => {
    logger.emit('deleteMember', req.body);

    const memberId = req.body.Id;

    if(!memberId) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Validation Error": `'memberId' is required` }));
        return;
    }

    if(!ObjectID.isValid(memberId)) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `'${memberId}' is not a valid ObjectId` }));
        return;
    }

    const member = await dataStore.getMemberById(memberId);

    if(!member) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Member with Id ${memberId} does not exist` }));
        return;
    }

    if(member.eventAttendances.length != 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ "Internal Error": `Cannot delete member with associated attendances` }));
        return;
    }

    next();
}

exports.deleteMember = async (req, res) => {
    const memberId = req.body.Id;

    await dataStore.deleteMember(memberId);

    res.status(200).send('Deleted');
};

exports.searchMemberValidator = async (req, res, next) => {
    logger.emit('searchMember', req.query);

    const membername = req.query.membername;
    const status = req.query.status;

    if(membername == undefined && status == undefined) {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({ "Validation Error": `You must specify one of the following: 'membername', 'status'` }));
        return;
    }

    next();
};

exports.searchMember = async (req, res) => {
    const membername = req.query.membername;
    const status = req.query.status;

    let searchParams = {};

    if(membername != undefined) {
        searchParams['name'] = membername;
    }

    if(status != undefined) {
        searchParams['status'] = status;
    }

    const members = await dataStore.searchMembers(searchParams);

    res.send(members);
};