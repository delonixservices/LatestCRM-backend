const Lead = require('../models/leadModel');
const { validationResult } = require('express-validator');




//New Lead Controller
const newLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse `numberOfClients` if it's sent as a string
    if (typeof req.body.numberOfClients === 'string') {
      try {
        req.body.numberOfClients = JSON.parse(req.body.numberOfClients);
      } catch (parseError) {
        return res.status(400).json({ 
          error: 'Invalid numberOfClients format', 
          details: 'Failed to parse numberOfClients as JSON.' 
        });
      }
    }

    // Ensure `numberOfClients` matches the expected structure
    const { numberOfClients } = req.body;
    if (numberOfClients && typeof numberOfClients !== 'object') {
      return res.status(400).json({
        error: 'Invalid numberOfClients format',
        details: 'numberOfClients must be an object with valid fields.'
      });
    }

    const lead = new Lead({
      ...req.body,
      assignee: req.user.id
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


// Update Lead Controller

const updateLead = async (req, res) => {
      console.log("Update Lead request received ");
     
      try {
        const lead = await Lead.findById(req.params.id);
        console.log("Lead found:", lead);
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found' });
        }
    
        // Update the lead with new values
        Object.keys(req.body).forEach(key => {
          if (key !== '_id' && key !== 'messages') {
            lead[key] = req.body[key];
          }
        });
    
        await lead.save();
        res.json(lead);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
      }
    }


// Delete Lead Controller

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.remove();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Get Lead Controller
const getLead = async (req, res) => {
  
    try {
      let leads;
      if (req.user.role === 'admin' || req.user.permissions.leadViewAll) {
        leads = await Lead.find().populate('assignee', 'name email');
      } else {
        leads = await Lead.find({ assignee: req.user.id }).populate('assignee', 'name email');
      }
      res.json(leads);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

// Get Lead by ID Controller

const getLeadById = async (req, res)  => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignee', 'name email');
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

//


module.exports = {
  newLead,
  updateLead,
  deleteLead,
  getLead,
  getLeadById
};