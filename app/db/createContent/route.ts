import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { data, link, category, title } = await req.json();

  if (!data?.user?.email || !link || !title || !category) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: data.user.email,
    },
  });

  if (!foundUser) {
    return NextResponse.json({ message: "user not found" });
  }

  const content = await prisma.content.create({
    data: {
      type: category,
      link: link,
      title: title,
      userId: foundUser.id,
    },
  });

  return NextResponse.json({ message: content }, { status: 200 });
}
