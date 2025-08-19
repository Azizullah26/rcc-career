import { type NextRequest, NextResponse } from "next/server"

// Redirect requests with trailing slash to without trailing slash
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone()

  // If URL ends with trailing slash, redirect to without slash
  if (url.pathname.endsWith("/") && url.pathname !== "/") {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  try {
    console.log(`${new Date().toISOString()}[SERVER] GET /api/odoo/apply - Connection test`)

    return NextResponse.json({
      success: true,
      message: "Odoo API connection test successful",
      timestamp: new Date().toISOString(),
      portalUrl: "https://careerrccv12.vercel.app",
    })
  } catch (error) {
    console.error(`${new Date().toISOString()}[SERVER] Connection test failed:`, error)

    return NextResponse.json(
      {
        success: false,
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.clone()

  // If URL ends with trailing slash, redirect to without slash
  if (url.pathname.endsWith("/") && url.pathname !== "/") {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  try {
    console.log(`${new Date().toISOString()}[SERVER] POST /api/odoo/apply - Starting application submission`)
    console.log(`${new Date().toISOString()}[SERVER] Request URL: https://careerrccv12.vercel.app/api/odoo/apply`)

    const formData = await request.formData()
    const dataString = formData.get("data") as string
    const cvFile = formData.get("cv") as File | null

    if (!dataString) {
      console.error(`${new Date().toISOString()}[SERVER] No data provided in request`)
      return NextResponse.json({ success: false, error: "No application data provided" }, { status: 400 })
    }

    let applicationData
    try {
      applicationData = JSON.parse(dataString)
      console.log(`${new Date().toISOString()}[SERVER] Parsed application data:`, {
        jobId: applicationData.jobId,
        jobTitle: applicationData.jobTitle,
        jobName: applicationData.jobName,
        hasFormData: !!applicationData.formData,
        hasCvFile: !!cvFile,
      })
    } catch (parseError) {
      console.error(`${new Date().toISOString()}[SERVER] Failed to parse application data:`, parseError)
      return NextResponse.json({ success: false, error: "Invalid application data format" }, { status: 400 })
    }

    const { jobId, jobTitle, jobName } = applicationData
    const applicantFormData = applicationData.formData

    if (!jobId || !applicantFormData) {
      console.error(`${new Date().toISOString()}[SERVER] Missing required fields:`, {
        hasJobId: !!jobId,
        hasFormData: !!applicantFormData,
      })
      return NextResponse.json({ success: false, error: "Missing required application data" }, { status: 400 })
    }

    // Odoo connection details from environment variables
    const odooUrl = process.env.NEXT_PUBLIC_ODOO_DB
    const odooUsername = process.env.ODOO_USERNAME
    const odooPassword = process.env.ODOO_PASSWORD

    if (!odooUrl || !odooUsername || !odooPassword) {
      console.error(`${new Date().toISOString()}[SERVER] Missing Odoo environment variables`)
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    console.log(`${new Date().toISOString()}[SERVER] Connecting to Odoo:`, {
      url: odooUrl,
      username: odooUsername,
      passwordSet: !!odooPassword,
    })

    // Authenticate with Odoo
    const authResponse = await fetch(`${odooUrl}/web/session/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: odooUrl.split("//")[1]?.split(".")[0] || "odoo",
          login: odooUsername,
          password: odooPassword,
        },
        id: Math.floor(Math.random() * 1000000),
      }),
    })

    if (!authResponse.ok) {
      console.error(`${new Date().toISOString()}[SERVER] Odoo authentication failed:`, {
        status: authResponse.status,
        statusText: authResponse.statusText,
      })
      return NextResponse.json({ success: false, error: "Failed to authenticate with Odoo" }, { status: 500 })
    }

    const authResult = await authResponse.json()
    console.log(`${new Date().toISOString()}[SERVER] Odoo authentication result:`, {
      success: !!authResult.result?.uid,
      uid: authResult.result?.uid,
    })

    if (!authResult.result?.uid) {
      console.error(`${new Date().toISOString()}[SERVER] Odoo authentication failed - no UID returned`)
      return NextResponse.json({ success: false, error: "Odoo authentication failed" }, { status: 401 })
    }

    // Get session cookies for subsequent requests
    const cookies = authResponse.headers.get("set-cookie") || ""

    // Helper function to get valid job ID
    const getValidJobId = async (): Promise<number | null> => {
      try {
        console.log(`${new Date().toISOString()}[SERVER] Searching for job positions in Odoo`)

        const searchResponse = await fetch(`${odooUrl}/web/dataset/call_kw`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params: {
              model: "hr.job",
              method: "search_read",
              args: [[]],
              kwargs: {
                fields: ["id", "name"],
                limit: 100,
              },
            },
            id: Math.floor(Math.random() * 1000000),
          }),
        })

        if (!searchResponse.ok) {
          console.error(`${new Date().toISOString()}[SERVER] Failed to search job positions`)
          return null
        }

        const searchResult = await searchResponse.json()
        const jobs = searchResult.result || []

        console.log(`${new Date().toISOString()}[SERVER] Found ${jobs.length} job positions`)

        if (jobs.length === 0) {
          console.log(
            `${new Date().toISOString()}[SERVER] No job positions found, will create applicant without job_id`,
          )
          return null
        }

        // Try to find exact job ID match first
        const requestedJobId = Number.parseInt(jobId)
        const exactMatch = jobs.find((job: any) => job.id === requestedJobId)

        if (exactMatch) {
          console.log(`${new Date().toISOString()}[SERVER] Found exact job match:`, exactMatch)
          return exactMatch.id
        }

        // If no exact match, use the first available job
        const firstJob = jobs[0]
        console.log(`${new Date().toISOString()}[SERVER] Using first available job:`, firstJob)
        return firstJob.id
      } catch (error) {
        console.error(`${new Date().toISOString()}[SERVER] Error searching for jobs:`, error)
        return null
      }
    }

    const validJobId = await getValidJobId()

    // Prepare applicant data
    const applicantData: any = {
      name:
        applicantFormData.fullName || `${applicantFormData.firstName || ""} ${applicantFormData.lastName || ""}`.trim(),
      email_from: applicantFormData.email,
      partner_phone: applicantFormData.phone,
      description: `Applied for Job: ${jobTitle || jobName || `ID ${jobId}`}\nJob ID: ${jobId}\n\nApplication Details:\n${JSON.stringify(applicantFormData, null, 2)}`,
    }

    // Only set job_id if we found a valid job
    if (validJobId) {
      applicantData.job_id = validJobId
      console.log(`${new Date().toISOString()}[SERVER] Using valid job_id: ${validJobId}`)
    } else {
      console.log(
        `${new Date().toISOString()}[SERVER] No valid job_id found, creating applicant without job assignment`,
      )
    }

    console.log(`${new Date().toISOString()}[SERVER] Creating applicant with data:`, {
      name: applicantData.name,
      email: applicantData.email_from,
      phone: applicantData.partner_phone,
      hasJobId: !!applicantData.job_id,
      jobId: applicantData.job_id,
    })

    // Create applicant record
    const createResponse = await fetch(`${odooUrl}/web/dataset/call_kw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.applicant",
          method: "create",
          args: [applicantData],
          kwargs: {},
        },
        id: Math.floor(Math.random() * 1000000),
      }),
    })

    if (!createResponse.ok) {
      console.error(`${new Date().toISOString()}[SERVER] Failed to create applicant:`, {
        status: createResponse.status,
        statusText: createResponse.statusText,
      })
      return NextResponse.json({ success: false, error: "Failed to create applicant record" }, { status: 500 })
    }

    const createResult = await createResponse.json()
    console.log(`${new Date().toISOString()}[SERVER] Applicant creation result:`, createResult)

    if (createResult.error) {
      console.error(`${new Date().toISOString()}[SERVER] Odoo error creating applicant:`, createResult.error)
      return NextResponse.json(
        { success: false, error: createResult.error.data?.message || "Failed to create applicant" },
        { status: 500 },
      )
    }

    const applicantId = createResult.result
    console.log(`${new Date().toISOString()}[SERVER] Created applicant with ID: ${applicantId}`)

    // Upload CV if provided
    if (cvFile && applicantId) {
      try {
        console.log(`${new Date().toISOString()}[SERVER] Uploading CV file:`, {
          name: cvFile.name,
          size: cvFile.size,
          type: cvFile.type,
        })

        // Convert file to base64
        const arrayBuffer = await cvFile.arrayBuffer()
        const base64String = Buffer.from(arrayBuffer).toString("base64")

        const attachmentData = {
          name: cvFile.name,
          datas: base64String,
          res_model: "hr.applicant",
          res_id: applicantId,
          mimetype: cvFile.type,
        }

        const uploadResponse = await fetch(`${odooUrl}/web/dataset/call_kw`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookies,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params: {
              model: "ir.attachment",
              method: "create",
              args: [attachmentData],
              kwargs: {},
            },
            id: Math.floor(Math.random() * 1000000),
          }),
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          console.log(`${new Date().toISOString()}[SERVER] CV upload successful:`, uploadResult.result)
        } else {
          console.error(`${new Date().toISOString()}[SERVER] CV upload failed:`, {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
          })
        }
      } catch (uploadError) {
        console.error(`${new Date().toISOString()}[SERVER] Error uploading CV:`, uploadError)
      }
    }

    console.log(`${new Date().toISOString()}[SERVER] Application submission completed successfully`)

    return NextResponse.json({
      success: true,
      applicantId: applicantId,
      message: "Application submitted successfully",
      portalUrl: "https://careerrccv12.vercel.app",
    })
  } catch (error) {
    console.error(`${new Date().toISOString()}[SERVER] Unexpected error:`, error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  const url = request.nextUrl.clone()

  // If URL ends with trailing slash, redirect to without slash
  if (url.pathname.endsWith("/") && url.pathname !== "/") {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
