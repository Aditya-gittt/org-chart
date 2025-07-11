import {prismaClient} from "@/db";

export async function dataByEmail(email: string) {
    try{
        const data = await prismaClient.user.findUnique({
            where: {
            email: email
            }
        });

        if(!data) {
            return null;
        }
        const {managerEmail, managerId, ...restdata} = data;
        return restdata;

    } catch (err) {
        console.log("error while searhing by email for auth");
        console.log(err);
        return null;
    }
    
}