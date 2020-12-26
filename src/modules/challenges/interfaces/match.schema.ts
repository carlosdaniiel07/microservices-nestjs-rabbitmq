import { Schema } from "mongoose";

export const MatchSchema = new Schema({
  category: String,
  date: Date,
  winner: { type: Schema.Types.ObjectId, ref: 'Player' },
  results: [
    { set: String }
  ],
  players: [
    { type: Schema.Types.ObjectId, ref: 'Player' }
  ],
}, {
  timestamps: true,
  collection: 'matches'
})