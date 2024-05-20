import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    user?: User;
    _id?: string;
    username?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
