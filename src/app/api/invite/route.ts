import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Guest from "@/models/Guest";

// POST /api/invite — validate a code and return ticket data
export async function POST(req: NextRequest) {
  try {
    const { code, eventId } = await req.json();

    if (!code || !eventId) {
      return NextResponse.json({ success: false, error: "Code requis" }, { status: 400 });
    }

    await connectDB();

    const guest = await Guest.findOne({
      code: code.trim().toUpperCase(),
      eventId,
    });

    if (!guest) {
      return NextResponse.json({ success: false, error: "Code invalide" }, { status: 404 });
    }

    if (guest.status === "declined") {
      return NextResponse.json({ success: false, error: "Invitation déclinée" }, { status: 403 });
    }

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return NextResponse.json({ success: false, error: "Événement introuvable" }, { status: 404 });
    }

    // Update status to confirmed if pending
    if (guest.status === "pending") {
      guest.status = "confirmed";
      guest.confirmedAt = new Date();
      await guest.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        guest: {
          id: guest._id,
          fullName: guest.fullName,
          code: guest.code,
          status: guest.status,
        },
        event: {
          title: event.title,
          date: event.date,
          time: event.time,
          doorsOpen: event.doorsOpen,
          venue: event.venue,
          address: event.address,
          city: event.city,
          theme: event.theme,
        },
      },
    });
  } catch (err) {
    console.error("[INVITE]", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
