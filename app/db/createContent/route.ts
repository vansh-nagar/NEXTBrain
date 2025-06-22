import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CohereClient } from "cohere-ai";

const co = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

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

    const document = [category, title, description];
    const embedding = await co.embed({
      texts: document,
      model: "embed-v4.0",
      inputType: "search_document",
      embeddingTypes: ["float"],
    });

    console.log("Embedding created:", embedding.embeddings.float[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "content exists" }, { status: 500 });
  }

  return NextResponse.json({ message: content }, { status: 200 });
}
