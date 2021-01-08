import { Schema } from "mongoose";

export const MatchSchema = new Schema({
  category: String,
  date: Date,
  winner: { type: Schema.Types.ObjectId },
  results: [
    { set: String }
  ],
  players: [
    { type: Schema.Types.ObjectId }
  ],
}, {
  timestamps: true,
  collection: 'matches'
})