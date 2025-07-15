import {auth} from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export default auth( (req: NextRequest) => {
    const user = req.auth?.user;

    if(!user){
        return NextResponse.redirect(new URL('/sign-in', req.url) )
    }

    if(req.nextUrl.pathname.startsWith('/admin') ) {
        if( user.role != "admin") {
            return NextResponse.redirect(new URL('/unauthorized', req.url) );
        }
    }

    return NextResponse.next();
} ) ;

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"]
} ;

