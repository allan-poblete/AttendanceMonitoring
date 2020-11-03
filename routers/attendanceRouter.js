const express = require('express');

const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', attendanceController.getAllAttendances);
router.get('/:Id', attendanceController.getAttendanceByIdValidator, attendanceController.getAttendanceById);
router.post('/', attendanceController.addAttendanceValidator, attendanceController.addAttendance);
router.put('/', attendanceController.updateAttendanceValidator, attendanceController.updateAttendance);
router.delete('/', attendanceController.deleteAttendanceValidator, attendanceController.deleteAttendance);

module.exports = router;