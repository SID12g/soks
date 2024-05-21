import Signin from "@/components/signin/signin";
import styles from "./page.module.css";
import Signout from "@/components/signout/signout";
import Signup from "@/components/signup/signup";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { connectDB } from "@/utils/database";
import Link from "next/link";

export default async function Home() {
  const session: any = await getServerSession(authOptions);
  let db = (await connectDB).db("chat");
  let chats = await db
    .collection("group")
    .find({ users: { $in: [session?.user.user._id.toString()] } })
    .toArray();

  return (
    <main className={styles.main}>
      <div style={{ display: "flex" }}>
        {session ? session.user.user.username + " 님" : "로그인 필요"}
        <div style={{ width: 10 }} />
        {session ? (
          <Signout />
        ) : (
          <div>
            <Signin />
            <Signup />
          </div>
        )}
      </div>
      {session ? (
        <div>
          <form method="POST" action="/api/chatting/group/add">
            <input name="withchat" />
            <input name="name" placeholder="방 이름" />
            <input
              defaultValue={session.user.user._id.toString()}
              name="maker"
              style={{ display: "none" }}
            />
            <button>와 채팅방 만들기</button>
          </form>
          <div>
            {chats.map((a, i) => (
              <Link key={i} href={`/chat/${a._id.toString()}`}>
                <div>{a.name.toString()}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>로그인 해야지</div>
      )}
    </main>
  );
}
