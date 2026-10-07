/**
 * Full-project Rendering & Route Health Checker
 * Verifies that all pages and endpoints render HTTP 200 without any runtime or SSR errors.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const ROUTES_TO_TEST = [
  // Public & Patient routes
  "/",
  "/clinics",
  "/clinics/cardiology-center",
  "/booking/confirmation",
  "/patient/dashboard",

  // Doctor Dashboard routes
  "/doctor",
  "/doctor/queue",
  "/doctor/appointments",
  "/doctor/patients",
  "/doctor/consultations",
  "/doctor/prescriptions",
  "/doctor/labs",
  "/doctor/follow-ups",
  "/doctor/availability",
  "/doctor/notifications",
  "/doctor/settings",
  "/doctor/subscription",

  // Admin routes
  "/admin/dashboard",
  "/admin/appointments",
  "/admin/doctors",
  "/admin/patients",
  "/admin/clinics",
  "/admin/billing",
  "/admin/reports",
  "/admin/settings",

  // Core API endpoints
  "/api/doctor/subscription",
  "/api/doctor/subscription/audit-logs",
  "/api/public/doctors/doc-tariq-01/appointments",
];

async function checkAllRoutes() {
  console.log("\n========================================================");
  console.log("       FULL-PROJECT RENDERING & ROUTE HEALTH CHECK      ");
  console.log("========================================================\n");

  let passed = 0;
  let failed = 0;
  const errorDetails = [];

  for (const route of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${route}`;
    const startTime = Date.now();
    try {
      const res = await fetch(url, {
        headers: {
          "x-doctor-id": "doc-tariq-01",
        },
      });
      const duration = Date.now() - startTime;
      const text = await res.text();

      // Check for Next.js internal error indicators
      const hasNextError =
        text.includes("Internal Server Error") ||
        text.includes("Application error:") ||
        text.includes("Unhandled Runtime Error") ||
        text.includes("webpack-internal://");

      if (res.ok && !hasNextError) {
        console.log(`✅ [200 OK] ${route.padEnd(46)} (${duration}ms)`);
        passed++;
      } else {
        console.error(`❌ [HTTP ${res.status}] ${route.padEnd(46)} (${duration}ms)`);
        if (hasNextError) {
          console.error(`   └─ Page returned 200 but contained Next.js error text!`);
        }
        failed++;
        errorDetails.push({ route, status: res.status, text: text.slice(0, 300) });
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      console.error(`❌ [FAILED] ${route.padEnd(46)} (${duration}ms): ${err.message}`);
      failed++;
      errorDetails.push({ route, status: 0, error: err.message });
    }
  }

  console.log("\n========================================================");
  console.log(`TOTAL ROUTES TESTED: ${ROUTES_TO_TEST.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);

  if (failed === 0) {
    console.log("🎉 ZERO RENDERING ERRORS DETECTED ACROSS THE ENTIRE PROJECT!");
  } else {
    console.error(`⚠️ ${failed} route(s) encountered issues:`);
    errorDetails.forEach((e) => console.error(JSON.stringify(e, null, 2)));
  }
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

checkAllRoutes();
