import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    n: 1,
    stream: false,
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user always as Mr.Neel and say welcome to Todo App! Limit the responce to 200 characters ",
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos, then tell the user to have a productive day! Here's the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  console.log(response.choices[0].message);

  return NextResponse.json(response.choices[0].message);
}
