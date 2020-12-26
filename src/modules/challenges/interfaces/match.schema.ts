import { Schema } from "mongoose";

export const MatchSchema = new Schema({
  date: Date,
  challenger: { type: Schema.Types.ObjectId, ref: 'Player' },
  results: [
    { set: String }
  ],
  players: [
    { type: Schema.Types.ObjectId, ref: 'Player' }
  ],
}, {
  timestamps: true,
  collection: 'Matches'
})