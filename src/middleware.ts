import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/api",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
];

// Middleware ฟังก์ชัน
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ถ้า path เป็น public หรือระบบ ให้ผ่านเลย
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ตรวจสอบ cookie session ของ next-auth (ปรับชื่อ cookie ตามโปรเจคได้)
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // ถ้าไม่มี token (ยังไม่ล็อกอิน) ให้ redirect ไป /login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // มี token ให้ผ่าน
  return NextResponse.next();
}

// บอก next ว่า middleware จะทำงานกับ path ไหนบ้าง
export const config = {
  matcher: ["/((?!login|_next|api|favicon.ico|robots.txt).*)"],
};
