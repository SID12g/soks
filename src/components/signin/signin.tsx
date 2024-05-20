"use client";

import { signIn } from "next-auth/react";

export default function Signin() {
  return <button onClick={() => signIn()}>로그인</button>;
}
