import { model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  username: { type: String, require: true },
  accessToken: { type: String, require: true },
  discriminator: { type: String, require: true },
  avatar: { type: String, require: true },
  walletAddress: { type: String, require: false },
  userid: { type: String, require: true },
  role: { type: String, default: 'user' },
  nonce: {
    type: Number
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
});

export default model('user', userSchema);
