import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== GET /api/test - Basic API Test ===")

    const response = {
      success: true,
      message: "API routes are working correctly",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
    }

    console.log("Test API response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        success: false,
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
    console.log("=== POST /api/test - Basic API Test ===")

    const response = {
      success: true,
      message: "POST endpoint is working correctly",
      timestamp: new Date().toISOString(),
      method: "POST",
    }

    console.log("Test POST API response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Test POST API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test POST API failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
