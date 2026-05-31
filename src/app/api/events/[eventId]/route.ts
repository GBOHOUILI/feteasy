import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Guest from "@/models/Guest";

interface Params { params: { eventId: string } }

async function getEventAndVerify(eventId: string, userId: string, role: string) {
  const event = await Event.findById(eventId);
  if (!event) return null;
  if (role !== "super_admin" && event.organizerId.toString() !== userId) return null;
  return event;
}

// GET /api/events/[eventId]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  await connectDB();
  const event = await getEventAndVerify(params.eventId, session.user.id, session.user.role);
  if (!event) return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });

  const guestCount = await Guest.countDocuments({ eventId: params.eventId });
  const confirmedCount = await Guest.countDocuments({ eventId: params.eventId, status: { $in: ["confirmed", "checked_in"] } });
  const checkedInCount = await Guest.countDocuments({ eventId: params.eventId, status: "checked_in" });

  return NextResponse.json({
    success: true,
    data: { ...event.toJSON(), stats: { total: guestCount, confirmed: confirmedCount, checkedIn: checkedInCount } }
  });
}

// PATCH /api/events/[eventId]
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  await connectDB();
  const event = await getEventAndVerify(params.eventId, session.user.id, session.user.role);
  if (!event) return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });

  const body = await req.json();
  const allowed = ["title","description","date","time","doorsOpen","venue","address","city","theme","isPublished","maxGuests","coverImage"];
  allowed.forEach(k => { if (body[k] !== undefined) (event as Record<string, unknown>)[k] = body[k]; });
  if (body.date) event.date = new Date(body.date);

  await event.save();
  return NextResponse.json({ success: true, data: event });
}

// DELETE /api/events/[eventId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  await connectDB();
  const event = await getEventAndVerify(params.eventId, session.user.id, session.user.role);
  if (!event) return NextResponse.json({ success: false, error: "Introuvable" }, { status: 404 });

  await Guest.deleteMany({ eventId: params.eventId });
  await event.deleteOne();
  return NextResponse.json({ success: true, message: "Événement supprimé" });
}
