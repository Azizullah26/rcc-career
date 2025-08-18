import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== GET /api/test - Environment Variables Test ===")

    const envVars = {
      ODOO_URL: process.env.ODOO_URL || "Not set",
      ODOO_DB: process.env.ODOO_DB || "Not set",
      ODOO_USERNAME: process.env.ODOO_USERNAME || "Not set",
      ODOO_PASSWORD: process.env.ODOO_PASSWORD ? "Set (hidden)" : "Not set",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "Not set",
      NEXT_PUBLIC_ODOO_DB: process.env.NEXT_PUBLIC_ODOO_DB || "Not set",
      NODE_ENV: process.env.NODE_ENV || "Not set",
    }

    console.log("Environment variables:", envVars)

    return NextResponse.json({
      success: true,
      message: "Test endpoint working with updated Odoo credentials",
      timestamp: new Date().toISOString(),
      environment: envVars,
    })
  } catch (error) {
    console.error("Test endpoint error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Test endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
