import { model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  userId: {
    type: String,
    require: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'projects'
  },
  rquserId: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  date: {
    type: Date
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
});

export default model('notification', userSchema);
