const Lead = require('../models/leadModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');




const newLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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



const updateLead = async (req, res) => {
      console.log("Update Lead request received ");
     
      try {
        const lead = await Lead.findById(req.params.id);
        console.log("Lead found:", lead);
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found' });
        }
    
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
const getAllLead = async (req, res) => {
  
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
  console.log("getLeadById called with ID:", req.params.id);
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



const getLeadsByAssignee = async (req, res) => {
  console.log("getLeadsByAssignee called with query:", req.query);
  try {
    const { assignee } = req.query;
    console.log("Assignee ID received:", assignee);

    if (!assignee) {
      return res.status(400).json({ message: "Assignee ID is required." });
    }

    let assigneeId;
    if (mongoose.Types.ObjectId.isValid(assignee)) {
      assigneeId = assignee;
    } else {
      const user = await User.findOne({ name: assignee });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      assigneeId = user._id;
    }

    const leads = await Lead.find()
      .populate({
        path: 'assignee',
        match: {
          _id: assigneeId,
        },
        select: 'name email',
      });

    const filteredLeads = leads.filter(lead => lead.assignee !== null);

    res.status(200).json(filteredLeads);
  } catch (error) {
    console.error('Error fetching leads by assignee:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




module.exports = {
  newLead,
  updateLead,
  deleteLead,
  getAllLead,
  getLeadById,
  getLeadsByAssignee
};