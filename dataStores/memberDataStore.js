const MemberModel = require('../models/memberModel');

getAllMembers = async() => {
    const members = MemberModel.find({})
        .populate({ path: 'eventAttendances',
            select: { timeIn: 1, timeOut: 1, _id: 1 },
        populate: { path: 'eventId', 
            select:{ eventName: 1, _id: 1 }}});

    return members;
};

getMemberById = async(memberId) => {
    const member = await MemberModel.findOne({ _id: memberId })
    .populate({ path: 'eventAttendances',
        select: { timeIn: 1, timeOut: 1, _id: 1 },
    populate: { path: 'eventId', 
        select:{ eventName: 1, _id: 1 }}});

    return member;
}

addMember = async(member) => {
    const memberModel = new MemberModel();

    Object.keys(member).forEach(propName => {
        memberModel[propName] = member[propName];
    });

    await memberModel.save();
};

searchMembers = async(searchParams) => {
    const events = await MemberModel.find(searchParams)
        .populate({ path: 'eventAttendances',
            select: { timeIn: 1, timeOut: 1, _id: 1 },
        populate: { path: 'eventId', 
            select:{ eventName: 1, _id: 1 }}});    

    return events;
}

updateMember = async(memberId, member) => {
    await MemberModel.findOneAndUpdate({ _id: memberId }, member);
};

deleteMember = async(memberId) => {
    await MemberModel.findOneAndDelete({ _id: memberId });
}

module.exports = { getAllMembers, getMemberById, addMember, updateMember, searchMembers, deleteMember };
