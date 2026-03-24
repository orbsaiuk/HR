import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isUserRoute = createRouteMatcher([
  "/user(.*)",
  "/my-applications(.*)",
  "/messages(.*)",
]);
const isCareersRoute = createRouteMatcher(["/careers(.*)"]);
const isProjectsRoute = createRouteMatcher(["/projects(.*)"]);
const isRegisterOrgRoute = createRouteMatcher(["/register-organization(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, sessionClaims } = await auth();

  // Get account type from session claims (requires Clerk dashboard config)
  const accountType = sessionClaims?.metadata?.accountType;

  // Dashboard routes require an active organization
  if (isDashboardRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (!orgId) {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Register organization requires sign-in
  if (isRegisterOrgRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // User-directory routes are for regular users only.
  // Team members (users with an active org) should use the dashboard instead.
  if (isUserRoute(req) && userId && orgId) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // /careers requires sign-in and jobSeeker account type
  // Org members (team members) should use dashboard instead
  if (isCareersRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (accountType === "freelancer" || accountType === "orgMember") {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }
  }

  // /projects requires sign-in and freelancer account type
  // Org members (team members) should use dashboard instead
  if (isProjectsRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
    if (accountType === "jobSeeker" || accountType === "orgMember") {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
