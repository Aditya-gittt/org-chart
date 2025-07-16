"use server"
import {prismaClient} from "@/db"
import bcrypt from "bcryptjs"

export async function signupUser(email: string, password: string) : void {
    const hashedPassword = bcrypt.hash(password,10);
    const found = await prismaClient.verifiedUser.findFirst({
        where: {
            email: email
        }
    });

    if(found) {
        throw Error("email already exists")
    }
}