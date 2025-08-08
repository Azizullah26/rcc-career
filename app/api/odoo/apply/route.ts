import { NextResponse } from "next/server"

type OdooAuthResponse = {
  result?: { uid?: number; session_id?: string }
  error?: { message?: string }
}

type OdooRPCResponse<T = any> = {
  result?: T
  error?: { message?: string }
}

/**
  Server Route to:
  1) Authenticate to Odoo JSON-RPC
  2) Create hr.applicant with provided data
  3) Optionally upload a CV as ir.attachment linked to the applicant

  Environment variables required on the server:
  - ODOO_URL
  - ODOO_DB
  - ODOO_USER
  - ODOO_PASSWORD
*/
export async function POST(request: Request) {
  try {
    // Allow JSON or multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    let payload: any = {}
    let file: File | null = null

    if (contentType.includes("application/json")) {
      payload = await request.json()
      file = null
    } else {
      const form = await request.formData()
      const dataStr = form.get("data")
      if (typeof dataStr !== "string") {
        return NextResponse.json(
          { success: false, error: "Invalid or missing 'data' JSON field in form-data." },
          { status: 400 }
        )
      }
      payload = JSON.parse(dataStr)
      const maybeFile = form.get("cv")
      file = maybeFile instanceof File ? maybeFile : null
    }

    const {
      // Required
      jobId,
      formData,
    } = payload as {
      jobId: string
      formData: {
        fullName: string
        email: string
        phone: string
        dob?: string
        nationality?: string
        gender?: string
        maritalStatus?: string
        totalExperience?: string
        uaeExperience?: string
        currentLocation?: string
        expectedSalary?: string
        joiningPossibility?: string
        uaeDrivingLicense?: string // yes/no
        relocationPossibility?: string // yes/no
        languages?: Array<{ id: number; language: string; proficiency: string }>
        previouslyWorked?: string // yes/no
        workDetails?: string
        relativesOrFriends?: string // yes/no
        names?: string
        selectedRelationships?: string[]
        experienceData?: Record<string, string>
      }
    }

    if (!jobId || !formData?.fullName || !formData?.email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: jobId, fullName, email." },
        { status: 400 }
      )
    }

    // Read Odoo env (server-only)
    const ODOO_URL = process.env.ODOO_URL || process.env.NEXT_PUBLIC_ODOO_URL || ""
    const ODOO_DB = process.env.ODOO_DB || process.env.NEXT_PUBLIC_ODOO_DATABASE || ""
    const ODOO_USER = process.env.ODOO_USER || process.env.NEXT_PUBLIC_ODOO_USERNAME || ""
    const ODOO_PASSWORD = process.env.ODOO_PASSWORD || process.env.NEXT_PUBLIC_ODOO_PASSWORD || ""

    if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Odoo configuration. Set ODOO_URL, ODOO_DB, ODOO_USER, ODOO_PASSWORD environment variables.",
        },
        { status: 500 }
      )
    }

    // 1) Authenticate
    const authRes = await fetch(`${ODOO_URL}/web/session/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: ODOO_DB,
          login: ODOO_USER,
          password: ODOO_PASSWORD,
        },
      }),
    })
    const authJson = (await authRes.json()) as OdooAuthResponse
    const sessionId = authJson?.result?.session_id
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: `Odoo authentication failed${authJson?.error?.message ? `: ${authJson.error.message}` : ""}`,
        },
        { status: 500 }
      )
    }

    // 2) Create hr.applicant
    const applicationData = {
      // Personal
      partner_name: formData.fullName,
      email_from: formData.email,
      partner_phone: formData.phone,
      date_of_birth: formData.dob || null,
      nationality: formData.nationality || null,
      gender: formData.gender || null,
      marital_status: formData.maritalStatus || null,

      // Job-related
      job_id: parseInt(jobId, 10),
      name: `Application for Job ID: ${jobId} - ${formData.fullName}`,
      description: "Application submitted through career portal",

      // Experience
      total_experience: formData.totalExperience || null,
      uae_experience: formData.uaeExperience || null,
      current_location: formData.currentLocation || null,
      expected_salary: formData.expectedSalary || null,
      joining_possibility: formData.joiningPossibility || null,

      // Additional info
      uae_driving_license: formData.uaeDrivingLicense === "yes",
      relocation_possibility: formData.relocationPossibility === "yes",
      languages: JSON.stringify(formData.languages || []),

      // Application Questions
      previously_worked: formData.previouslyWorked === "yes",
      work_details: formData.workDetails || "",
      relatives_friends: formData.relativesOrFriends === "yes",
      relative_names: formData.names || "",
      relationships: JSON.stringify(formData.selectedRelationships || []),

      // Experience Data
      experience_data: JSON.stringify(formData.experienceData || {}),
    }

    const createRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_id=${sessionId}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.applicant",
          method: "create",
          args: [applicationData],
          kwargs: {},
        },
      }),
    })

    const createJson = (await createRes.json()) as OdooRPCResponse<number>
    const applicantId = createJson?.result
    if (!applicantId) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create application${createJson?.error?.message ? `: ${createJson.error.message}` : ""}`,
        },
        { status: 500 }
      )
    }

    // 3) Upload CV if provided
    let attachmentId: number | null = null
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      // @ts-ignore - Buffer is available server-side
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      const attachmentPayload = {
        name: file.name || "cv.pdf",
        datas: base64,
        res_model: "hr.applicant",
        res_id: applicantId,
        mimetype: file.type || "application/octet-stream",
        description: "CV/Resume",
      }

      const attachRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "ir.attachment",
            method: "create",
            args: [attachmentPayload],
            kwargs: {},
          },
        }),
      })

      const attachJson = (await attachRes.json()) as OdooRPCResponse<number>
      attachmentId = attachJson?.result || null
    }

    return NextResponse.json({
      success: true,
      applicant_id: applicantId,
      attachment_id: attachmentId,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unexpected server error" },
      { status: 500 }
    )
  }
}
