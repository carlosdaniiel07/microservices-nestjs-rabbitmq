import { Schema } from "mongoose";

export const ChallengeSchema = new Schema({
  category: String,
  date: Date,
  status: String,
  requestDate: Date,
  responseDate: Date,
  requester: { type: Schema.Types.ObjectId },
  players: [
    { type: Schema.Types.ObjectId }
  ],
  match: { type: Schema.Types.ObjectId, ref: 'Match' }
}, {
  timestamps: true,
  collection: 'challenges'
})