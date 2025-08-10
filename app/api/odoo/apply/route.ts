import { type NextRequest, NextResponse } from "next/server"

interface JobApplicationData {
  jobId: string
  formData: {
    // Personal Information
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    nationality: string
    gender: string
    maritalStatus: string

    // Experience Information
    totalExperience: string
    uaeExperience: string
    currentLocation: string
    expectedSalary: string
    joiningPossibility: string

    // Additional Information
    uaeDrivingLicense: boolean
    relocationPossibility: boolean
    languages: Array<{
      language: string
      proficiency: string
    }>

    // Application Questions
    previouslyWorked: boolean
    workDetails: string
    relativesOrFriends: boolean
    relativeNames: string
    relationships: Array<{
      name: string
      relationship: string
      department: string
    }>

    // Experience Data
    experienceData: Array<{
      company: string
      position: string
      duration: string
      responsibilities: string
    }>
  }
}

async function authenticateOdoo() {
  const odooUrl = process.env.ODOO_URL
  const odooDb = process.env.ODOO_DB
  const odooUser = process.env.ODOO_USER
  const odooPassword = process.env.ODOO_PASSWORD

  if (!odooUrl || !odooDb || !odooUser || !odooPassword) {
    throw new Error("Missing Odoo configuration")
  }

  const authResponse = await fetch(`${odooUrl}/web/session/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        db: odooDb,
        login: odooUser,
        password: odooPassword,
      },
    }),
  })

  const authResult = await authResponse.json()

  if (authResult.error) {
    throw new Error(`Odoo authentication failed: ${authResult.error.message}`)
  }

  return {
    sessionId: authResult.result.session_id,
    userId: authResult.result.uid,
    cookies: authResponse.headers.get("set-cookie"),
  }
}

async function createJobApplication(sessionData: any, applicationData: JobApplicationData) {
  const odooUrl = process.env.ODOO_URL
  const { formData, jobId } = applicationData

  const applicantData = {
    name: `${formData.firstName} ${formData.lastName}`,
    email_from: formData.email,
    partner_phone: formData.phone,
    job_id: Number.parseInt(jobId),

    // Personal Information
    date_of_birth: formData.dateOfBirth,
    nationality: formData.nationality,
    gender: formData.gender,
    marital_status: formData.maritalStatus,

    // Experience Information
    total_experience: formData.totalExperience,
    uae_experience: formData.uaeExperience,
    current_location: formData.currentLocation,
    expected_salary: formData.expectedSalary,
    joining_possibility: formData.joiningPossibility,

    // Additional Information
    uae_driving_license: formData.uaeDrivingLicense,
    relocation_possibility: formData.relocationPossibility,
    languages: JSON.stringify(formData.languages),

    // Application Questions
    previously_worked: formData.previouslyWorked,
    work_details: formData.workDetails,
    relatives_friends: formData.relativesOrFriends,
    relative_names: formData.relativeNames,
    relationships: JSON.stringify(formData.relationships),

    // Experience Data
    experience_data: JSON.stringify(formData.experienceData),

    // Source Information
    source_website: "RCC Career Portal",
    application_date: new Date().toISOString(),
  }

  const createResponse = await fetch(`${odooUrl}/web/dataset/call_kw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionData.cookies || "",
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
    }),
  })

  const createResult = await createResponse.json()

  if (createResult.error) {
    throw new Error(`Failed to create application: ${createResult.error.message}`)
  }

  return createResult.result
}

async function uploadCV(sessionData: any, applicantId: number, file: File) {
  const odooUrl = process.env.ODOO_URL

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer()
  const base64Data = Buffer.from(arrayBuffer).toString("base64")

  const attachmentData = {
    name: file.name,
    datas: base64Data,
    res_model: "hr.applicant",
    res_id: applicantId,
    mimetype: file.type,
  }

  const uploadResponse = await fetch(`${odooUrl}/web/dataset/call_kw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionData.cookies || "",
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
    }),
  })

  const uploadResult = await uploadResponse.json()

  if (uploadResult.error) {
    throw new Error(`Failed to upload CV: ${uploadResult.error.message}`)
  }

  return uploadResult.result
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const dataString = formData.get("data") as string
    const cvFile = formData.get("cv") as File | null

    if (!dataString) {
      return NextResponse.json({ error: "Missing application data" }, { status: 400 })
    }

    const applicationData: JobApplicationData = JSON.parse(dataString)

    console.log("Received application data:", applicationData)

    // Authenticate with Odoo
    const sessionData = await authenticateOdoo()
    console.log("Authenticated with Odoo successfully")

    // Create job application
    const applicantId = await createJobApplication(sessionData, applicationData)
    console.log("Created job application with ID:", applicantId)

    // Upload CV if provided
    let attachmentId = null
    if (cvFile && cvFile.size > 0) {
      attachmentId = await uploadCV(sessionData, applicantId, cvFile)
      console.log("Uploaded CV with attachment ID:", attachmentId)
    }

    return NextResponse.json({
      success: true,
      applicantId,
      attachmentId,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json(
      {
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
