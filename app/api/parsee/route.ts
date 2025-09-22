import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PARSEE_API_KEY = "3c2898a5-d8ed-409e-9bf0-cab76f7d3c55"
const PARSEE_API_URL = "https://api.parsee.ai/v1/parse"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Parsee.ai API route called")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    console.log("📄 Processing file:", file.name, file.type, file.size)

    // Create FormData for Parsee.ai API
    const parseeFormData = new FormData()
    parseeFormData.append("file", file)
    parseeFormData.append("extract_structured_data", "true")
    parseeFormData.append("extract_text", "true")

    console.log("🚀 Sending request to Parsee.ai...")

    // Make request to Parsee.ai API
    const response = await fetch(PARSEE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PARSEE_API_KEY}`,
      },
      body: parseeFormData,
    })

    console.log("📥 Parsee.ai response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Parsee.ai API error:", response.status, errorText)

      return NextResponse.json(
        {
          success: false,
          error: `Parsee.ai API Error: ${response.status} - ${errorText}`,
        },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("✅ Parsee.ai parsing successful")
    console.log("📊 Result keys:", Object.keys(result))

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("❌ Parsee.ai API route error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
