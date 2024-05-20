import { connectDB } from "@/utils/database";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password: string | any = formData.get("password")?.toString();
  const hash = await bcrypt.hash(password, 10);
  const user = {
    username,
    password: hash,
  };

  let db = (await connectDB).db("auth");
  let dbuser = await db.collection("users").findOne({ username: username });

  if (dbuser) {
    return NextResponse.json({
      status: 409,
      error: "해당 번호는 이미 존재합니다.",
    });
  }

  try {
    let db = (await connectDB).db("auth");
    await db.collection("users").insertOne(user);
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  }
}
