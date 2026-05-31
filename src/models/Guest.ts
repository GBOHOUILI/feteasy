import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuestDocument extends Document {
  eventId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  code: string;
  status: "pending" | "confirmed" | "declined" | "checked_in";
  confirmedAt?: Date;
  checkedInAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuestDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "checked_in"],
      default: "pending",
    },
    confirmedAt: { type: Date },
    checkedInAt: { type: Date },
    note: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Compound index for fast lookups
GuestSchema.index({ eventId: 1, code: 1 });
GuestSchema.index({ eventId: 1, status: 1 });

const Guest: Model<IGuestDocument> =
  mongoose.models.Guest || mongoose.model<IGuestDocument>("Guest", GuestSchema);

export default Guest;
