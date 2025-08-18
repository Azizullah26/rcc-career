import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== API Test Route ===")
    console.log("Environment variables check:")
    console.log("ODOO_URL:", process.env.ODOO_URL)
    console.log("ODOO_DB:", process.env.ODOO_DB)
    console.log("ODOO_USERNAME:", process.env.ODOO_USERNAME)
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
    console.log("NODE_ENV:", process.env.NODE_ENV)

    const response = {
      success: true,
      message: "Test API endpoint is working",
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        odooUrl: process.env.ODOO_URL || "Not set",
        odooDb: process.env.ODOO_DB || "Not set",
        odooUsername: process.env.ODOO_USERNAME || "Not set",
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "Not set",
      },
    }

    console.log("Test response:", response)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Test API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Test API failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function POST() {
  return NextResponse.json(
    {
      success: true,
      message: "Test POST endpoint is working",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
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
