"use server"
import {prismaClient} from "@/db"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signupUser(email: string, password: string) {

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
                email: email,
                password: hashedPassword
            }
        })
        if(created) {
            await signIn("Credentials", {
                email: email,
                password: password,
                redirect: false
            });

            redirect("/");
        }

    } catch (err) {
        throw Error('Error while adding to DB : {err}');
    }
    
}