import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dataByEmail } from "./ServerCode/dataByEmail";

export const {
    auth,
    handlers,
    signIn,
    signOut
} = NextAuth({
    pages: {
        signIn: "/sign-in"
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email" , type: "email"},
                password: {label:"Password", type: "password"}
            } ,
            async authorize(credentials) {
                if(!credentials){
                    return null;
                }
                const result = await dataByEmail(credentials.email, credentials.password);
                return result;
            }
        })
    ],
    session: {strategy:"jwt"},
    secret: process.env.AUTH_SECRET,
    callbacks: {
        jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({session, token}){
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        }
    }
} satisfies NextAuthOptions);



