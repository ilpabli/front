import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: any) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET)
    );
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    req.user = user;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin"],
};
