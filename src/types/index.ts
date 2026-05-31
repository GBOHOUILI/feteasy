// ─── User ────────────────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "organizer" | "super_admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export interface IEvent {
  _id: string;
  organizerId: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  doorsOpen?: string;
  venue: string;
  address: string;
  city: string;
  coverImage?: string;
  theme: EventTheme;
  slug: string;
  isPublished: boolean;
  maxGuests?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type EventTheme = "luxury" | "tropical" | "minimal" | "retro" | "neon";

// ─── Guest ───────────────────────────────────────────────────────────────────
export interface IGuest {
  _id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  code: string;
  status: GuestStatus;
  confirmedAt?: Date;
  checkedInAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GuestStatus = "pending" | "confirmed" | "declined" | "checked_in";

// ─── API responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── NextAuth ────────────────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "organizer" | "super_admin";
    };
  }
  interface User {
    id: string;
    role: "organizer" | "super_admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "organizer" | "super_admin";
  }
}
