"use server"
import {prismaClient} from "@/db"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signupUser(name: string, role: string, email: string, password: string) {

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        const found = await prismaClient.verifiedUser.findFirst({
            where: {
                email: email
            }
        });

        if(found) {
            throw Error("email already exists")
        }

        const created = await prismaClient.verifiedUser.create({
            data: {
                name: name,
                role,
                email: email,
                password: hashedPassword
            }
        })
        if(created) {
            const signedIn = await signIn("Credentials", {
                email: email,
                password: password,
                redirect: false
            });
            if(signIn.error) {
                throw Error(`Cant signin ${signIn.error}`)
            }
            redirect("/");
        }

    } catch (err) {
        throw Error('Error while adding to DB and SignIn: {err}');
    }
    
}