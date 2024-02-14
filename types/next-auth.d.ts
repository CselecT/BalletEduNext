// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            role: string,
            schoolId: null | number,
            juryId: null | number,
        } & DefaultSession
    }

    interface User extends DefaultUser {
        role: string,
        schoolId: null | number,
        juryId: null | number,
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: string,
        schoolId: null | number,
        juryId: null | number,
    }
}