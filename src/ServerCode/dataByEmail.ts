import "server-only"
import {prismaClient} from "@/db";
import bcrypt from "bcryptjs";

export async function dataByEmail(email: string, checkPassword: string) {
    try{
        const data = await prismaClient.verifiedUser.findUnique({
            where: {
            email: email
            }
        });

        if(!data) {
            return null;
        }

        if( !(await bcrypt.compare(checkPassword, data.password)) ) {
            return null;
        }

        const {password, ...restdata} = data;
        return restdata;

    } catch (err) {
        console.log("error while searhing by email for auth");
        console.log(err);
        return null;
    }
    
}