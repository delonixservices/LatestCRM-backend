const router = require('express').Router();
const {protect, isAdmin} = require('../middleware/auth');
const { newLead, updateLead, getAllLead, getLeadById, deleteLead ,getLeadsByAssignee}  = require('../controller/leadController');



router.post('/new',protect, newLead);  //api/leads/new 
router.put('/update/:id',protect, updateLead);//api/leads/update/:id
router.get('/emp',protect, getLeadsByAssignee); //api/leads/emp/:id

router.get('/all',protect,isAdmin, getAllLead);//api/leads/all
router.get('/:id',protect, getLeadById);//api/leads/:id
router.delete('/:id',protect, deleteLead);//api/leads/:id
module.exports = router;