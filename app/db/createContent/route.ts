import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { data, link, category, title, description } = await req.json();

  if (!data?.user?.email || !title || !category) {
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
    return NextResponse.json({ message: "user not found" }, { status: 400 });
  }

  let content;
  try {
    content = await prisma.content.create({
      data: {
        type: category,
        link: link || null,
        title: title,
        userId: foundUser.id,
        description: description || "",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "content exists" }, { status: 500 });
  }

  return NextResponse.json({ message: content }, { status: 200 });
}
