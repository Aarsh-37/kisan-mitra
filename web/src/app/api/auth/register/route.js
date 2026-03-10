import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { name, email, password: hashed } });

        return NextResponse.json({ message: "User created successfully." }, { status: 201 });
    } catch (error) {
        console.error("[REGISTER ERROR]", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
