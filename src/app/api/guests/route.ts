import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Guest from "@/models/Guest";
import { generateCode } from "@/lib/utils";

// GET /api/guests?eventId=xxx
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ success: false, error: "eventId requis" }, { status: 400 });

  await connectDB();

  // Verify ownership
  const event = await Event.findById(eventId);
  if (!event) return NextResponse.json({ success: false, error: "Événement introuvable" }, { status: 404 });
  if (session.user.role !== "super_admin" && event.organizerId.toString() !== session.user.id) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }

  const guests = await Guest.find({ eventId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: guests });
}

// POST /api/guests — add guest(s)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();
    const { eventId, firstName, lastName, email, phone, note } = body;

    if (!eventId || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    await connectDB();

    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ success: false, error: "Événement introuvable" }, { status: 404 });
    if (session.user.role !== "super_admin" && event.organizerId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    }

    // Generate unique code
    let code: string;
    let attempts = 0;
    do {
      code = generateCode(firstName);
      attempts++;
      if (attempts > 20) throw new Error("Impossible de générer un code unique");
    } while (await Guest.exists({ code }));

    const guest = await Guest.create({
      eventId, firstName, lastName,
      fullName: `${firstName} ${lastName}`,
      email, phone, code, note,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (err) {
    console.error("[GUESTS POST]", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
