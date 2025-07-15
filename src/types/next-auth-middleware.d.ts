import "next/server";

declare module "next/server" {
    interface NextRequest {
        auth? : {
            user?: {
                id: string,
                role: string
            }
        }
    }
}