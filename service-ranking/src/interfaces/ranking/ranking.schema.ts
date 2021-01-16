import { Schema } from "mongoose";

export const RankingSchema = new Schema({
  match: { type: Schema.Types.ObjectId },
  category: { type: Schema.Types.ObjectId },
  player: { type: Schema.Types.ObjectId },
  event: String,
  operation: String,
  points: Number,
}, {
  timestamps: true,
  collection: 'ranking'
}) 