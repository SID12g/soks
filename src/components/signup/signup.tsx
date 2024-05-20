import Link from "next/link";

export default function Signup() {
  return (
    <Link href={"/signup"}>
      <button>회원가입</button>
    </Link>
  );
}
