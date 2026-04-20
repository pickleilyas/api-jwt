const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  create: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  update: {
    type: Boolean,
    default: false
  },
  delete: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissions: {
    clients: {
      type: PermissionSchema,
      default: () => ({})
    },
    products: {
      type: PermissionSchema,
      default: () => ({})
    },
    orders: {
      type: PermissionSchema,
      default: () => ({})
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);