const router = require('express').Router();
const {protect} = require('../middleware/auth');
const { newLead, updateLead, getAllLeads, getLeadById, deleteLead}  = require('../controller/leadController');



router.post('/new',protect, newLead);
router.put('/update/:id',protect, updateLead);

module.exports = router;