const express = require('express');

const memberController = require('../controllers/memberController');

const router = express.Router();

router.get('/', memberController.getAllMembers);
router.get('/search', memberController.searchMemberValidator, memberController.searchMember);
router.get('/:Id', memberController.getMemberByIdValidator, memberController.getMemberById);
router.post('/', memberController.addMemberValidator, memberController.addMember);
router.put('/', memberController.updateMemberValidator, memberController.updateMember);
router.delete('/', memberController.deleteMemberValidator, memberController.deleteMember);

module.exports = router;