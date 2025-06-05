const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateOfTravel: {
    type: Date
  },
  dateofCreation: {
    type: Date,
    default: Date.now
  },
  destination: {
    type: String,
    required: true
  },
  departureCity: {
    type: String,
    required: true
  },
  numberOfClients: {
    rooms: {
      type: Number,
      default: 0
    },
    adults: {
      type: Number,
      default: 0
    },
    children: {
      type: Number,
      default: 0
    },
    childrenAges: [{
      type: Number
    }]
  },
  assignee: {
    type: String,
    ref: 'User',
    required: true
  },
  numberofPacks: String,
  numberofDays: String,
  budget: String,
  leadSource: String,
  leadStatus: {
    type: String,
    default: 'New'
  },
  verificationStatus: {
    type: String,
    default: 'No'
  },
  needOfFlight: {
    type: String,
    default: 'No'
  },
  notes: String,
  editHistory: [{
    field: String,
    oldValue: String,
    newValue: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastEdited: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    changes: [{
      field: String,
      oldValue: String,
      newValue: String
    }]
  },
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    importedFromExcel: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
 
},
);




// Update the updatedAt timestamp before saving
leadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Track changes to lead fields
leadSchema.pre('save', function(next) {
  if (this.isModified()) {
    const changes = [];
    this.modifiedPaths().forEach(path => {
      if (path !== 'updatedAt' && path !== 'lastEdited') {
        changes.push({
          field: path,
          oldValue: this.get(path, String),
          newValue: this._update?.$set?.[path] || this.get(path, String)
        });
      }
    });

    if (changes.length > 0) {
      this.lastEdited = {
        timestamp: new Date(),
        changes
      };
      this.editHistory.push(...changes.map(change => ({
        ...change,
        timestamp: new Date()
      })));
    }
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema); 