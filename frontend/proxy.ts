import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp: number;
}

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (!token) {
        if (isAdminRoute) return NextResponse.redirect(new URL("/login", request.url));
        return NextResponse.next();
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("token");
            return response;
        }

        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (isAuthRoute) return NextResponse.redirect(new URL("/", request.url));
        if (isAdminRoute && role !== "Admin") {
            const url = new URL("/", request.url);
            url.searchParams.set("error", "unauthorized");
            return NextResponse.redirect(url);
        }

    } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login", "/register"],
};