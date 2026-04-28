import { NextResponse } from "next/server"

// Add runtime configuration for Vercel
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ODOO_URL = process.env.ODOO_URL || "https://erp.elrace.com"
const ODOO_DB = process.env.ODOO_DB || "odoo.elrace.com"
const ODOO_USERNAME = process.env.ODOO_USERNAME || "odoobot@example.com"
const ODOO_PASSWORD = process.env.ODOO_PASSWORD

if (!ODOO_PASSWORD) {
  console.error("[v0] ERROR: ODOO_PASSWORD environment variable is not set. Jobs API will fail.")
}

function sanitizeText(text: string | null | undefined): string {
  if (!text) return ""

  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, "")

  // Replace problematic characters
  sanitized = sanitized
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .replace(/\r\n/g, " ") // Replace Windows line breaks
    .replace(/\n/g, " ") // Replace Unix line breaks
    .replace(/\r/g, " ") // Replace Mac line breaks
    .replace(/\t/g, " ") // Replace tabs
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()

  return sanitized
}

class OdooJobService {
  private sessionId: string | null = null
  private uid: number | null = null
  private cookies: string[] = []

  async authenticate(): Promise<boolean> {
    try {
      console.log("[v0] Authenticating with Odoo for jobs...")
      console.log("[v0] Auth params - DB:", ODOO_DB, "User:", ODOO_USERNAME)

      const authResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            db: ODOO_DB,
            login: ODOO_USERNAME,
            password: ODOO_PASSWORD,
          },
          id: Math.floor(Math.random() * 1000000),
        }),
      })

      if (!authResponse.ok) {
        console.error("[v0] Authentication failed:", authResponse.status, authResponse.statusText)
        return false
      }

      const setCookieHeaders = authResponse.headers.get("set-cookie")
      if (setCookieHeaders) {
        this.cookies = setCookieHeaders.split(", ")
      }

      const authData = await authResponse.json()

      console.log("[v0] Full auth response:", JSON.stringify(authData, null, 2))

      console.log("[v0] Auth response received:", {
        hasResult: !!authData.result,
        hasUid: !!(authData.result && authData.result.uid),
        hasError: !!authData.error,
      })

      if (authData.error) {
        console.error("[v0] Odoo authentication error:", authData.error)
        return false
      }

      if (authData.result && authData.result.uid) {
        this.uid = authData.result.uid
        this.sessionId = authData.result.session_id
        console.log("[v0] Authentication successful for jobs, UID:", this.uid)
        return true
      }

      console.error("[v0] Authentication response missing uid. Result contents:", authData.result)
      return false
    } catch (error) {
      console.error("[v0] Authentication error:", error)
      return false
    }
  }

  async fetchJobs(): Promise<any[]> {
    if (!this.uid) {
      throw new Error("Not authenticated")
    }

    try {
      console.log("[v0] Fetching jobs from Odoo...")

      const searchPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            ODOO_DB,
            this.uid,
            ODOO_PASSWORD,
            "hr.job",
            "search_read",
            [
              [["state", "=", "recruit"]], // Only active recruiting positions
            ],
            {
              fields: [
                "id",
                "name",
                "department_id",
                "no_of_recruitment",
                "description",
                "requirements",
                "x_requirements",
                "create_date",
                "write_date",
              ],
              limit: 100,
            },
          ],
        },
        id: Math.floor(Math.random() * 1000000),
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (this.cookies.length > 0) {
        headers.Cookie = this.cookies.join("; ")
      }

      if (this.sessionId) {
        headers.Cookie = (headers.Cookie ? headers.Cookie + "; " : "") + `session_id=${this.sessionId}`
      }

      const response = await fetch(`${ODOO_URL}/jsonrpc`, {
        method: "POST",
        headers,
        body: JSON.stringify(searchPayload),
      })

      if (!response.ok) {
        console.error("[v0] Failed to fetch jobs:", response.status)
        return []
      }

      const data = await response.json()

      if (data.error) {
        console.error("[v0] Odoo error fetching jobs:", data.error)
        return []
      }

      const jobs = data.result || []
      console.log(`[v0] Fetched ${jobs.length} jobs from Odoo`)

      return jobs.map((job: any, index: number) => {
        const requirementsText = job.requirements || job.x_requirements || ""

        // Log if requirements field is empty to help with debugging
        if (!requirementsText) {
          console.log(`[v0] Job "${job.name}" (ID: ${job.id}) has no requirements data`)
        }

        const requirementsArray = requirementsText
          ? requirementsText
              .split("\n")
              .filter((r: string) => r.trim())
              .map((r: string) => sanitizeText(r))
          : []

        return {
          id: job.id,
          referenceNumber: `RCC${String(1001 + index)}`,
          title: sanitizeText(job.name) || "Untitled Position",
          department: job.department_id ? sanitizeText(job.department_id[1]) : "General",
          location: "UAE",
          type: "Full-time",
          experience: "As per requirements",
          postingDate: job.create_date
            ? new Date(job.create_date).toLocaleDateString("en-GB")
            : new Date().toLocaleDateString("en-GB"),
          description: sanitizeText(job.description) || "No description available",
          requirements: requirementsArray,
        }
      })
    } catch (error) {
      console.error("[v0] Error fetching jobs:", error)
      return []
    }
  }
}

// GET endpoint to fetch jobs
export async function GET() {
  try {
    console.log("[v0] === GET /api/odoo/jobs - Fetching Jobs ===")

    const jobService = new OdooJobService()

    // Authenticate
    const authenticated = await jobService.authenticate()
    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Odoo",
          jobs: [],
        },
        { status: 500 },
      )
    }

    // Fetch jobs
    const jobs = await jobService.fetchJobs()

    return NextResponse.json(
      {
        success: true,
        jobs,
        count: jobs.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error in GET /api/odoo/jobs:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch jobs",
        details: error instanceof Error ? error.message : "Unknown error",
        jobs: [],
      },
      { status: 500 },
    )
  }
}

// OPTIONS endpoint for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
