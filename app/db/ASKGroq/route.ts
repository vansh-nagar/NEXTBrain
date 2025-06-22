import { prisma } from "@/lib/prisma";
import "dotenv/config";
import Groq from "groq-sdk/index.mjs";
import { NextResponse, NextRequest } from "next/server";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log(process.env.GROQ_API_KEY);
import { createEmbed } from "@/lib/createEmbed";

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

  const sqlVecMessage = await createEmbed({ document: [message] });

  const QueryPGvector = await prisma.$queryRaw`
  SELECT id , type  , title , description , link ,
  embedding <=> ${sqlVecMessage}::vector AS distance
  FROM "Content"
  WHERE "userId" = ${foundUser?.id}
  ORDER BY distance 
  LIMIT 5
  `;

  console.log("QueryPGvector", QueryPGvector);

  const TransationResponse = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant designed to retrieve and present the most relevant information from the user's saved content based on their query.
                    Below is the user's saved content (as an array of objects). Each item may contain fields such as title, link, type, description, etc. Use this data to provide filtered, accurate answers to the user's questions:
                    ${JSON.stringify(QueryPGvector, null, 2)}
                    please always return the found content in a JSON format with the following structure:  {
                    type: 'youtube',
                    link: 'https://www.youtube.com/watch?v=wb8WZplqkxU&list=PL0V_JTTg_6baV8tBE4Qm1O8Vhxy59GTah&index=3',
                    title: 'top skill',
                    description: '',
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
