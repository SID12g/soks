import Message from "./Message";
import { connectDB } from "@/utils/database";

export default async function Page({ params }: { params: { id: string } }) {
  let db = (await connectDB).db("chat");
  let chats = await db
    .collection("chatting")
    .find({ groupId: params.id })
    .toArray();

  return <Message params={params} chats={chats} />;
}
