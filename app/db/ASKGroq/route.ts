import { prisma } from "@/lib/prisma";
import "dotenv/config";
import Groq from "groq-sdk/index.mjs";
import { NextResponse, NextRequest } from "next/server";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log(process.env.GROQ_API_KEY);

export async function POST(request: NextRequest) {
  const { message, session } = await request.json();
  if (!message || !session) {
    return NextResponse.json(
      { error: "Message and session are required." },
      { status: 400 }
    );
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      content: true,
    },
  });

  const TransationResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant designed to retrieve and present the most relevant information from the user's saved content based on their query.
                    The user's name is "${foundUser?.name || "Unknown"}".
                    Below is the user's saved content (as an array of objects). Each item may contain fields such as title, link, type, description, etc. Use this data to provide filtered, accurate answers to the user's questions:
                    ${JSON.stringify(foundUser?.content, null, 2)}
                    please always return the found content in a JSON format with the following structure:  {
                    id: 116,
                    type: 'youtube',
                    link: 'https://www.youtube.com/watch?v=wb8WZplqkxU&list=PL0V_JTTg_6baV8tBE4Qm1O8Vhxy59GTah&index=3',
                    title: 'top skill',
                    description: '',
                    userId: 'cmc4pre0500001222igrp1ngm',
                    updateAt: 2025-06-21T06:03:06.892Z,
                    createdAt: 2025-06-21T06:03:06.892Z
    }  don't give any other information, just return the JSON object.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const result = TransationResponse.choices[0].message.content || "";

  return NextResponse.json({ result });
}
