import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { generateSlug } from "@/lib/utils";

// GET /api/events — list organizer's events
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  await connectDB();

  const query = session.user.role === "super_admin" ? {} : { organizerId: session.user.id };
  const events = await Event.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ success: true, data: events });
}

// POST /api/events — create event
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, date, time, doorsOpen, venue, address, city, theme, maxGuests } = body;

    if (!title || !date || !time || !venue || !address || !city) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    await connectDB();

    const slug = generateSlug(title);
    const event = await Event.create({
      organizerId: session.user.id,
      title, description, date: new Date(date), time, doorsOpen,
      venue, address, city, theme: theme || "luxury",
      slug, isPublished: false, maxGuests,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err) {
    console.error("[EVENTS POST]", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
