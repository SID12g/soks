import { connectDB } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: Response) {
  const formData = await request.formData();
  const name = formData.get("name");
  const user1 = formData.get("maker");
  const user2 = formData.get("withchat");

  let db = (await connectDB).db("auth");
  let user2id = await db
    .collection("users")
    .find({ username: user2 })
    .toArray();

  const data = {
    name: name,
    users: [user1, user2id[0]._id.toString()],
  };

  const mainUrl = new URL("/", request.url);
  mainUrl.searchParams.set("from", request.nextUrl.pathname);

  try {
    let db = (await connectDB).db("chat");
    await db.collection("group").insertOne(data);
    return NextResponse.json({ status: 200, success: true });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
