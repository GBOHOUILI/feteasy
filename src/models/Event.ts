import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEventDocument extends Document {
  organizerId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  time: string;
  doorsOpen?: string;
  venue: string;
  address: string;
  city: string;
  coverImage?: string;
  theme: "luxury" | "tropical" | "minimal" | "retro" | "neon";
  slug: string;
  isPublished: boolean;
  maxGuests?: number;
  brandingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEventDocument>(
  {
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 1000 },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    doorsOpen: { type: String },
    venue: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    coverImage: { type: String },
    theme: {
      type: String,
      enum: ["luxury", "tropical", "minimal", "retro", "neon"],
      default: "luxury",
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    isPublished: { type: Boolean, default: false },
    maxGuests: { type: Number, min: 1 },
    brandingEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", EventSchema);

export default Event;
