import { NextResponse, type NextRequest } from "next/server";

const PARTNER_HOSTS = ["partners.fengshuiai.sg", "partners.localhost"];

function isPartnerHost(host: string): boolean {
  const bare = host.toLowerCase().split(":")[0];
  return PARTNER_HOSTS.includes(bare);
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const path = request.nextUrl.pathname;
  const partner = isPartnerHost(host);

  if (partner && !path.startsWith("/p")) {
    const url = request.nextUrl.clone();
    url.pathname = `/p${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
  }

  if (
    !partner &&
    path.startsWith("/p") &&
    process.env.NODE_ENV === "production"
  ) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
