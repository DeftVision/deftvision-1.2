const express = require("express");
const router = express.Router();
const {deleteSchedule, getSchedule, getSchedules, newSchedule, updateSchedule} = require("../controllers/SchedulerController");

router.post('/new', newSchedule);
router.get('/location/:locationId', getSchedules)
router.get('/:locationId', getSchedule);
router.patch('/update/:shiftId', updateSchedule);
router.delete('/delete/:shiftId', deleteSchedule);


module.exports = router;