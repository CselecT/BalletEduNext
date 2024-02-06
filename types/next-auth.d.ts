import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user?: DefaultUser & { id: string; role: string };
    }
    interface User extends DefaultUser {
        role: string;
    }
}