import { NextResponse } from "next/server"

// Add runtime configuration for Vercel
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ODOO_URL = process.env.ODOO_URL || "https://erp.elrace.com"
const ODOO_DB = process.env.ODOO_DB || "odoo.elrace.com"
const ODOO_USERNAME = process.env.ODOO_USERNAME || "jawad"
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "272127212721"

class OdooJobService {
  private sessionId: string | null = null
  private uid: number | null = null
  private cookies: string[] = []

  async authenticate(): Promise<boolean> {
    try {
      console.log("[v0] Authenticating with Odoo for jobs...")

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
        console.error("[v0] Authentication failed:", authResponse.status)
        return false
      }

      const setCookieHeaders = authResponse.headers.get("set-cookie")
      if (setCookieHeaders) {
        this.cookies = setCookieHeaders.split(", ")
      }

      const authData = await authResponse.json()

      if (authData.result && authData.result.uid) {
        this.uid = authData.result.uid
        this.sessionId = authData.result.session_id
        console.log("[v0] Authentication successful for jobs")
        return true
      }

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

      return jobs.map((job: any, index: number) => ({
        id: job.id,
        referenceNumber: `RCC${(1001 + index).toString()}`, // Generate sequential reference numbers
        title: job.name || "Untitled Position",
        department: job.department_id ? job.department_id[1] : "General",
        location: "UAE", // Default location, can be customized
        type: "Full-time",
        experience: "As per requirements",
        postingDate: job.create_date
          ? new Date(job.create_date).toLocaleDateString("en-GB")
          : new Date().toLocaleDateString("en-GB"),
        description: job.description || "No description available",
        requirements: job.requirements ? job.requirements.split("\n").filter((r: string) => r.trim()) : [],
      }))
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
