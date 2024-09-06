import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  userId: {
    type: String,
    require: true
  },
  serverId: {
    type: String,
    default: ''
  },
  roleId: {
    type: String,
    default: ''
  },
  channelId: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  projectStatus: {
    type: Number,
    default: 0
  },
  collabStatus: {
    type: Number,
    default: 0
  },
  userType: {
    type: Number,
    default: 0
  },
  twitterLink: {
    type: String,
    default: ''
  },
  discordLink: {
    type: String,
    default: ''
  },
  date: {
    type: Date
  }
});

export default model('pendingprojects', projectSchema);
