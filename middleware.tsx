import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(req: any) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = decodeJwt(token.value);
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const adminPaths = [
      "/",
      "/admin",
      "/admin/*",
      "/tickets",
      "/tickets/*",
      "/profile",
      "/tickets/create",
    ];
    const supervisorPaths = ["/tickets", "/tickets/*", "/profile"];
    const receptionistPaths = ["/tickets/create"];
    const userPaths = ["/monitor", "/monitor/*"];
    const technicianPaths = ["/monitor", "/monitor/*"];
    const userRole = user.role;
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
    const isSupervisorPath = supervisorPaths.some((path) =>
      pathname.startsWith(path)
    );
    const isReceptionistPath = receptionistPaths.some((path) =>
      pathname.startsWith(path)
    );
    const isUserPath = userPaths.some((path) => pathname.startsWith(path));
    const isTechnicianPath = technicianPaths.some((path) =>
      pathname.startsWith(path)
    );
    if (userRole === "admin") {
      return NextResponse.next();
    }

    if (userRole === "supervisor" && !isSupervisorPath) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (userRole === "receptionist" && !isReceptionistPath) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (userRole === "user" && !isUserPath) {
      return NextResponse.redirect(new URL("/monitor", req.url));
    }

    if (userRole === "technician" && !isTechnicianPath) {
      return NextResponse.redirect(new URL("/monitor", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/tickets/:path*", "/profile"],
};
