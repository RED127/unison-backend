import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  currentpage: {
    type: Number,
    require: true
  },
  mode: {
    type: String,
    require: true
  },
  collabId: {
    type: Schema.Types.ObjectId,
    ref: 'collabs'
  }
});

export default model('collabpagenation', customerSchema);
