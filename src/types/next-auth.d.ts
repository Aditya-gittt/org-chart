import NextAuth, { DefaultSession, DefaultJWT, DefaultUser} from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {id: string, role: string};
    }

    interface User extends DefaultUser {
        id: string,
        role: string
    }
    
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string,
        role: string
    }
}