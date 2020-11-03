const express = require('express');

const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/export', eventController.exportEventValidator, eventController.exportEvent);
router.get('/search', eventController.searchEventValidator, eventController.searchEvent);
router.get('/:Id', eventController.getEventByIdValidator, eventController.getEventById);
router.post('/', eventController.addEventValidator, eventController.addEvent);
router.put('/', eventController.updateEventValidator, eventController.updateEvent);
router.delete('/', eventController.deleteEventValidator, eventController.deleteEvent);

module.exports = router;