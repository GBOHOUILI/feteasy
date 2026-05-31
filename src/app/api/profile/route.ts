import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Event from "@/models/Event";
import Guest from "@/models/Guest";

// PATCH /api/profile — update name, email or password
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 },
    );

  const { name, email, currentPassword, newPassword } = await req.json();

  await connectDB();
  const user = await User.findById(session.user.id).select("+password");
  if (!user)
    return NextResponse.json(
      { success: false, error: "Utilisateur introuvable" },
      { status: 404 },
    );

  if (name) user.name = name.trim();
  if (email && email !== user.email) {
    const exists = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: user._id },
    });
    if (exists)
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé" },
        { status: 409 },
      );
    user.email = email.toLowerCase().trim();
  }

  if (newPassword) {
    if (!currentPassword)
      return NextResponse.json(
        { success: false, error: "Mot de passe actuel requis" },
        { status: 400 },
      );
    const valid = await user.comparePassword(currentPassword);
    if (!valid)
      return NextResponse.json(
        { success: false, error: "Mot de passe actuel incorrect" },
        { status: 400 },
      );
    if (newPassword.length < 8)
      return NextResponse.json(
        { success: false, error: "8 caractères minimum" },
        { status: 400 },
      );
    user.password = newPassword;
  }

  await user.save();
  return NextResponse.json({
    success: true,
    data: { name: user.name, email: user.email },
  });
}

// DELETE /api/profile — delete account + all data
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 },
    );

  const { password } = await req.json();
  if (!password)
    return NextResponse.json(
      { success: false, error: "Mot de passe requis pour confirmer" },
      { status: 400 },
    );

  await connectDB();
  const user = await User.findById(session.user.id).select("+password");
  if (!user)
    return NextResponse.json(
      { success: false, error: "Introuvable" },
      { status: 404 },
    );

  const valid = await user.comparePassword(password);
  if (!valid)
    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 400 },
    );

  // Cascade delete: events + guests
  const events = await Event.find({ organizerId: user._id }).select("_id");
  const eventIds = events.map((e) => e._id);
  if (eventIds.length) await Guest.deleteMany({ eventId: { $in: eventIds } });
  await Event.deleteMany({ organizerId: user._id });
  await user.deleteOne();

  return NextResponse.json({ success: true, message: "Compte supprimé" });
}
