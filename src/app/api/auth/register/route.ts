import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    await connectDB();

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const user = await User.create({ name, email, password, role: "organizer" });

    return NextResponse.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
