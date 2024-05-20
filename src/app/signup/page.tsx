import { connectDB } from "@/utils/database";

export default async function Signup() {
  return (
    <div>
      <form method="POST" action="/api/auth/signup">
        <input name="username" />
        <input name="password" type="password" />
        <button type="submit">가입</button>
      </form>
    </div>
  );
}
