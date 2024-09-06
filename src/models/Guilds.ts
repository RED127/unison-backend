import { Schema, model } from 'mongoose';

const guildSchema = new Schema({
  userId: {
    type: String,
    require: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  permissions: {
    type: String,
    default: 0
  },
  icon: {
    type: String,
    default: null
  },
  owner: {
    type: Boolean,
    default: false
  },
  features: {
    type: Array,
    default: []
  }
});

export default model('guilds', guildSchema);
