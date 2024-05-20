import { connectDB } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData();
  const chat = formData.get("chat");
  const owner = formData.get("owner");
  const group = formData.get("group");
  const data = {
    chat,
    owner,
    group,
    createAt: new Date(),
  };
  const url = request.url;
  const mainUrl = new URL(`http://localhost:3000/chat/${group}`, request.url);
  mainUrl.searchParams.set("from", request.nextUrl.pathname);

  try {
    let db = (await connectDB).db("chat");
    await db.collection("chatting").insertOne(data);
    return Response.redirect(mainUrl);
  } catch (error) {
    return Response.json({ status: 500, error });
  }
}
