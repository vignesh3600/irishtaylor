import mongoose from 'mongoose';

export const auditPlugin = (schema) => {
  schema.add({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  });

  schema.pre('save', function setUpdatedAt(next) {
    this.updatedAt = new Date();
    next();
  });
};
