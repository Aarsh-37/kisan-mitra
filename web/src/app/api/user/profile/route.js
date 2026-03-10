import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, phone, location, farmSize, farmingType, bio } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone,
                location,
                farmSize: farmSize ? parseFloat(farmSize) : null,
                farmingType,
                bio
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[PROFILE UPDATE ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
