import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Guest from "@/models/Guest";

// POST /api/scan — scan a QR code / check-in a guest
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });

  try {
    const { code, eventId } = await req.json();

    if (!code || !eventId) {
      return NextResponse.json({ success: false, error: "Code et eventId requis" }, { status: 400 });
    }

    await connectDB();

    // Verify the organizer owns this event
    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ success: false, error: "Événement introuvable" }, { status: 404 });
    if (session.user.role !== "super_admin" && event.organizerId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    }

    const guest = await Guest.findOne({ code: code.trim().toUpperCase(), eventId });

    if (!guest) {
      return NextResponse.json({
        success: false,
        result: "invalid",
        error: "Code introuvable — invitation invalide",
      }, { status: 404 });
    }

    if (guest.status === "checked_in") {
      return NextResponse.json({
        success: false,
        result: "already_checked_in",
        data: { fullName: guest.fullName, checkedInAt: guest.checkedInAt },
        error: "Déjà enregistré",
      }, { status: 409 });
    }

    if (guest.status === "declined") {
      return NextResponse.json({
        success: false,
        result: "declined",
        error: "Invitation déclinée",
      }, { status: 403 });
    }

    // Check in the guest
    guest.status = "checked_in";
    guest.checkedInAt = new Date();
    if (!guest.confirmedAt) guest.confirmedAt = new Date();
    await guest.save();

    return NextResponse.json({
      success: true,
      result: "checked_in",
      data: {
        fullName: guest.fullName,
        code: guest.code,
        checkedInAt: guest.checkedInAt,
      },
    });
  } catch (err) {
    console.error("[SCAN]", err);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
