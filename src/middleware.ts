import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|apple-touch-icon|manifest.webmanifest).*)",
  ],
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("verify")) {
    return NextResponse.next();
  }
  
  if(request.nextUrl.pathname.includes("privacy-policy")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken");

  if (token) {
    if (request.nextUrl.pathname.includes("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const publicURLs = ["/", "/verify"];
  if (publicURLs.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    if (publicURLs.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    if (
      !request.nextUrl.pathname.includes("/auth") &&
      !request.nextUrl.pathname.includes("_next")
    ) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}
