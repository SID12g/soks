import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "./socket/io";
import { connectDB } from "@/utils/database";

const chatHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (req.method === "POST") {
    let db = (await connectDB).db("chat");

    const message = JSON.parse(req.body);
    const data = {
      groupId: message.groupId,
      userId: message.userId,
      content: message.content,
    };
    db.collection("chatting").insertOne(data);
    let chat = await db
      .collection("users")
      .find({ groupId: message.groupId })
      .toArray();

    res.socket.server.io.emit("message", message);

    res.status(201).json(chat);
  }
};

export default chatHandler;
