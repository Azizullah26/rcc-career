import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== GET /api/test - Basic API Test ===")

    const response = {
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      endpoints: {
        test: "/api/test",
        odoo_apply: "/api/odoo/apply",
      },
      status: "healthy",
    }

    console.log("Test API response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        error: "Test API failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("=== POST /api/test - Basic POST Test ===")

    const response = {
      message: "POST endpoint is working correctly",
      timestamp: new Date().toISOString(),
      method: "POST",
      status: "healthy",
    }

    console.log("Test POST response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Test POST error:", error)
    return NextResponse.json(
      {
        error: "Test POST failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
