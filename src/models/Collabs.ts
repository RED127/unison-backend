import { Schema, model } from 'mongoose';

const collabSchema = new Schema(
  {
    userId: {
      type: String,
      require: true
    },
    messageId: {
      type: String,
      default: ''
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'projects'
    },
    enddate: {
      type: Date
    },
    inprogressdate: {
      type: Date
    },
    collabType: {
      type: Number,
      default: 1
    },
    expiretime: {
      type: Number,
      default: 0
    },
    expiretimemin: {
      type: Number,
      default: 10
    },

    format: {
      type: Number,
      default: 1
    },
    openedSpots: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      default: ''
    },
    requestBy: {
      projectName: {
        type: String,
        default: ''
      },
      oneTimeReq: {
        type: String,
        default: ''
      }
    },
    status: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    posted: {
      type: Boolean,
      default: false
    },
    inprogress: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default model('collabs', collabSchema);
