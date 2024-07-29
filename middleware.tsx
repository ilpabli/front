import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/monitor", req.url));
  }

  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const userRole = token.role as string;

  const adminPaths = ["/", "/admin", "/admin/*", "/tickets", "/tickets/*", "/profile", "/tickets/create", "/map"];
  const supervisorPaths = ["/tickets", "/tickets/*", "/profile", "/monitor", "/map"];
  const receptionistPaths = ["/tickets/create", "/monitor","/profile"];
  const userPaths = ["/monitor", "/monitor/*", "/profile"];
  const technicianPaths = ["/monitor", "/monitor/*","/profile"];

  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isSupervisorPath = supervisorPaths.some((path) => pathname.startsWith(path));
  const isReceptionistPath = receptionistPaths.some((path) => pathname.startsWith(path));
  const isUserPath = userPaths.some((path) => pathname.startsWith(path));
  const isTechnicianPath = technicianPaths.some((path) => pathname.startsWith(path));

  switch (userRole) {
    case "admin":
      return NextResponse.next();
    case "supervisor":
      if (!isSupervisorPath) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      break;
    case "receptionist":
      if (!isReceptionistPath) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      break;
    case "user":
      if (!isUserPath) {
        return NextResponse.redirect(new URL("/monitor", req.url));
      }
      break;
    case "technician":
      if (!isTechnicianPath) {
        return NextResponse.redirect(new URL("/monitor", req.url));
      }
      break;
    default:
      return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/login", "/admin/:path*", "/tickets/:path*", "/profile", "/map", "/monitor/:path*"],
};