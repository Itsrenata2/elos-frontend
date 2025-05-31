import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];
const PUBLIC_ROUTES = ["/login", "/register"];

export const middleware = (request) => {
  const currentPath = request.nextUrl.pathname;
  const token = request.cookies.get("authToken")?.value;

  const isStaticAsset = /\.(svg|png|jpg|pdf)$/.test(currentPath);
  if (isStaticAsset) {
    return NextResponse.next();
  }

  if (!token && !PUBLIC_ROUTES.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (!token && PUBLIC_ROUTES.includes(currentPath)) return NextResponse.next();

  const payload = jwtDecode(token);
  if (payload.role !== "ADMIN" && ADMIN_ROUTES.includes(currentPath)) {
    return NextResponse.redirect(new URL("/records", request.nextUrl));
  }

  if (payload.role === "ADMIN" && !ADMIN_ROUTES.includes(currentPath)) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
