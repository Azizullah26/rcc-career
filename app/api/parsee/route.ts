import { type NextRequest, NextResponse } from "next/server"

const PARSEE_API_KEY = "3c2898a5-d8ed-409e-9bf0-cab76f7d3c55"
const PARSEE_API_URL = "https://api.parsee.ai/v1/parse"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create FormData for Parsee.ai API
    const parseeFormData = new FormData()
    parseeFormData.append("file", file)
    parseeFormData.append("api_key", PARSEE_API_KEY)

    console.log("Sending file to Parsee.ai:", file.name, file.type, file.size)

    // Call Parsee.ai API
    const response = await fetch(PARSEE_API_URL, {
      method: "POST",
      body: parseeFormData,
    })

    if (!response.ok) {
      console.error("Parsee.ai API error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Parsee.ai error details:", errorText)

      return NextResponse.json(
        {
          error: "Failed to parse CV with Parsee.ai",
          details: errorText,
          fallback: true,
        },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("Parsee.ai response received:", result)

    return NextResponse.json({
      success: true,
      data: result,
      parsedBy: "parsee.ai",
    })
  } catch (error) {
    console.error("Parsee.ai API call error:", error)

    return NextResponse.json(
      {
        error: "Internal server error during CV parsing",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true,
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
