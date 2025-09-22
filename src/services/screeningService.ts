interface JobRequirement {
  name: string
  weight: number
  keywords: string[]
  formFields?: string[]
  minValue?: number
  type: "keyword" | "numeric" | "boolean" | "form"
}

interface ScreeningResult {
  qualified: boolean
  score: number
  percentage: number
  feedback: string[]
  matchedRequirements: string[]
  missedRequirements: string[]
  details: {
    [key: string]: {
      score: number
      found: boolean
      matches: string[]
    }
  }
}

interface ApplicationData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nationality: string
    gender: string
    totalExperience: string
    uaeExperience: string
    arabicLanguage: string
    englishLanguage: string
  }
  extendedQuestions: {
    civilEngineeringDegree: string
    projectManagementCertification: string
    governmentContractExperience: string
    leadershipExperience: string
  }
  cvFile?: File
}

class ApplicationScreeningService {
  private jobRequirements: JobRequirement[] = [
    {
      name: "Civil Engineering Degree",
      weight: 20,
      type: "keyword",
      keywords: [
        "civil engineering",
        "civil engineer",
        "bachelor of civil engineering",
        "bce",
        "b.sc civil",
        "structural engineering",
        "construction engineering",
        "infrastructure engineering",
        "transportation engineering",
        "geotechnical engineering",
        "environmental engineering",
        "water resources engineering",
        "highway engineering",
        "bridge engineering",
        "concrete engineering",
        "steel structures",
        "foundation engineering",
      ],
      formFields: ["civilEngineeringDegree"],
    },
    {
      name: "Total Experience ≥ 5 years",
      weight: 20,
      type: "numeric",
      keywords: ["experience", "years", "work experience", "professional experience"],
      formFields: ["totalExperience"],
      minValue: 5,
    },
    {
      name: "Project Management Certification",
      weight: 10,
      type: "keyword",
      keywords: [
        "pmp",
        "project management professional",
        "prince2",
        "capm",
        "certified associate",
        "project management certification",
        "project manager",
        "project management",
        "project coordinator",
        "project leader",
        "project director",
        "program manager",
        "construction project management",
        "infrastructure project management",
        "agile project management",
        "scrum master",
        "project planning",
        "project execution",
      ],
      formFields: ["projectManagementCertification"],
    },
    {
      name: "Leadership & Communication Skills",
      weight: 15,
      type: "keyword",
      keywords: [
        "lead",
        "leading",
        "leader",
        "leadership",
        "manage",
        "managing",
        "manager",
        "coordinate",
        "coordinating",
        "coordinator",
        "mentor",
        "mentoring",
        "supervise",
        "supervising",
        "supervisor",
        "team lead",
        "team leader",
        "team management",
        "staff management",
        "personnel management",
        "communication skills",
        "interpersonal",
        "presentation",
        "negotiation",
        "client relations",
        "stakeholder management",
        "team building",
        "conflict resolution",
        "decision making",
        "problem solving",
      ],
    },
    {
      name: "Government Contract Experience",
      weight: 15,
      type: "keyword",
      keywords: [
        "government",
        "government contract",
        "public sector",
        "municipal",
        "federal",
        "state contract",
        "public works",
        "infrastructure project",
        "government tender",
        "public procurement",
        "government agency",
        "ministry",
        "department",
        "roads and transport authority",
        "rta",
        "dubai municipality",
        "abu dhabi municipality",
        "federal authority",
        "emirates authority",
        "public private partnership",
        "ppp",
        "government compliance",
        "public infrastructure",
        "civic projects",
      ],
      formFields: ["governmentContractExperience"],
    },
    {
      name: "Languages (Arabic + English)",
      weight: 10,
      type: "form",
      keywords: ["arabic", "english", "bilingual", "multilingual"],
      formFields: ["arabicLanguage", "englishLanguage"],
    },
    {
      name: "UAE Experience",
      weight: 10,
      type: "keyword",
      keywords: [
        // UAE and Emirates
        "uae",
        "united arab emirates",
        "emirates",

        // Dubai and areas
        "dubai",
        "dxb",
        "dubai marina",
        "downtown dubai",
        "business bay",
        "jlt",
        "jumeirah lake towers",
        "jbr",
        "jumeirah beach residence",
        "palm jumeirah",
        "dubai internet city",
        "dic",
        "dubai media city",
        "dmc",
        "dubai international financial centre",
        "difc",
        "dubai silicon oasis",
        "dso",
        "dubai investment park",
        "dip",
        "dubai south",
        "al barsha",
        "jumeirah",
        "bur dubai",
        "deira",
        "karama",
        "satwa",
        "oud metha",
        "dubai festival city",
        "dubai land",
        "dubai sports city",
        "motor city",
        "arabian ranches",
        "the greens",
        "the views",
        "emirates hills",
        "dubai hills",
        "city walk",
        "la mer",
        "bluewaters",
        "dubai creek",
        "dubai mall",
        "mall of emirates",
        "dubai international airport",
        "al maktoum airport",
        "jebel ali",
        "dubai ports",
        "dubai metro",
        "sheikh zayed road",
        "emirates road",
        "al khail road",

        // Abu Dhabi and areas
        "abu dhabi",
        "auh",
        "al ain",
        "saadiyat island",
        "yas island",
        "reem island",
        "al raha",
        "khalifa city",
        "mohammed bin zayed city",
        "mbz city",
        "al reef",
        "al shamkha",
        "al rahba",
        "masdar city",
        "corniche",
        "marina mall",
        "yas mall",
        "abu dhabi mall",
        "nation towers",
        "etihad towers",
        "adnoc",
        "abu dhabi international airport",
        "zayed port",
        "khalifa port",
        "sheikh zayed grand mosque",
        "louvre abu dhabi",
        "ferrari world",
        "yas waterworld",
        "warner bros world",
        "formula 1 abu dhabi",

        // Sharjah and areas
        "sharjah",
        "shj",
        "university city",
        "al qasba",
        "al majaz",
        "al nahda",
        "muweilah",
        "al taawun",
        "al khan",
        "corniche sharjah",
        "sharjah airport",
        "sharjah city centre",
        "mega mall",
        "sahara centre",

        // Other Emirates
        "ajman",
        "fujairah",
        "ras al khaimah",
        "rak",
        "umm al quwain",
        "uaq",
        "khor fakkan",
        "dibba",
        "al dhaid",
        "masafi",
        "hatta",

        // UAE Projects and Landmarks
        "burj khalifa",
        "burj al arab",
        "atlantis",
        "dubai fountain",
        "miracle garden",
        "global village",
        "img worlds",
        "dubai aquarium",
        "ski dubai",
        "wild wadi",
        "aquaventure",
        "la perle",
        "blue waters",
        "ain dubai",
        "dubai frame",
        "museum of the future",
        "expo 2020",
        "expo city dubai",

        // UAE Companies and Organizations
        "etisalat",
        "du",
        "emirates airline",
        "flydubai",
        "etihad airways",
        "air arabia",
        "dewa",
        "dubai electricity",
        "addc",
        "abu dhabi distribution company",
        "sewa",
        "sharjah electricity",
        "fewa",
        "federal electricity",
        "emirates nbd",
        "adcb",
        "fab",
        "first abu dhabi bank",
        "mashreq bank",
        "dubai islamic bank",
        "ajman bank",
        "rak bank",
        "cbd",
        "commercial bank of dubai",
        "hsbc uae",
        "standard chartered uae",
        "citibank uae",

        // UAE Authorities and Government
        "rta",
        "roads and transport authority",
        "dubai municipality",
        "abu dhabi municipality",
        "sharjah municipality",
        "ajman municipality",
        "fujairah municipality",
        "rak municipality",
        "uaq municipality",
        "dubai health authority",
        "dha",
        "abu dhabi health authority",
        "haad",
        "dubai land department",
        "dld",
        "dubai economic development",
        "ded",
        "dubai tourism",
        "dtcm",
        "abu dhabi tourism",
        "department of culture and tourism",
        "dct",
        "dubai customs",
        "federal customs authority",
        "dubai police",
        "abu dhabi police",
        "emirates identity authority",
        "eia",
        "general directorate of residency",
        "gdrfa",
        "mohre",
        "ministry of human resources",
        "dubai courts",
        "adgm",
        "abu dhabi global market",
        "dubai international arbitration centre",
        "diac",
      ],
      formFields: ["uaeExperience"],
    },
  ]

  private qualificationThreshold = 50 // Changed from 75% to 50%

  async screenApplication(applicationData: ApplicationData): Promise<ScreeningResult> {
    console.log("Starting application screening...")

    let cvText = ""
    let parsedCVData: any = null

    // Parse CV if provided
    if (applicationData.cvFile) {
      try {
        const cvParsingResult = await this.parseCV(applicationData.cvFile)
        cvText = cvParsingResult.text
        parsedCVData = cvParsingResult.data
        console.log("CV parsed successfully, text length:", cvText.length)
      } catch (error) {
        console.error("CV parsing failed:", error)
        cvText = await this.extractBasicText(applicationData.cvFile)
        console.log("Using fallback text extraction, length:", cvText.length)
      }
    }

    const results: ScreeningResult = {
      qualified: false,
      score: 0,
      percentage: 0,
      feedback: [],
      matchedRequirements: [],
      missedRequirements: [],
      details: {},
    }

    let totalScore = 0

    // Evaluate each requirement
    for (const requirement of this.jobRequirements) {
      const evaluation = this.evaluateRequirement(requirement, applicationData, cvText, parsedCVData)

      results.details[requirement.name] = evaluation
      totalScore += evaluation.score

      if (evaluation.found) {
        results.matchedRequirements.push(requirement.name)
      } else {
        results.missedRequirements.push(requirement.name)
      }

      console.log(`${requirement.name}: ${evaluation.score}% (${evaluation.found ? "FOUND" : "NOT FOUND"})`)
      if (evaluation.matches.length > 0) {
        console.log(`  Matches: ${evaluation.matches.slice(0, 3).join(", ")}`)
      }
    }

    results.score = Math.round(totalScore)
    results.percentage = Math.round(totalScore)
    results.qualified = totalScore >= this.qualificationThreshold

    // Generate feedback
    if (results.qualified) {
      results.feedback = [
        `Congratulations! Your application scored ${results.percentage}% and meets our requirements.`,
        "Your application has been submitted to our HR team for review.",
        "We will contact you within 5-7 business days regarding the next steps.",
      ]
    } else {
      results.feedback = [
        "We will review your application. Your profile does not fully match our requirements, but we will keep it for future opportunities.",
        `Your application scored ${results.percentage}%. We look for candidates with at least ${this.qualificationThreshold}% match.`,
        "We encourage you to apply again in the future as you gain more relevant experience.",
      ]
    }

    console.log(`Final screening result: ${results.qualified ? "QUALIFIED" : "NOT QUALIFIED"} (${results.percentage}%)`)

    return results
  }

  private async parseCV(file: File): Promise<{ text: string; data: any }> {
    console.log("Attempting to parse CV with Parsee.ai...")

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/parsee", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Parsee.ai API error:", errorData)

      if (errorData.fallback) {
        // Use fallback extraction
        return {
          text: await this.extractBasicText(file),
          data: null,
        }
      }

      throw new Error(`Parsee.ai API failed: ${errorData.error}`)
    }

    const result = await response.json()
    console.log("Parsee.ai parsing successful")

    // Extract text from Parsee.ai response
    let extractedText = ""
    if (result.data && result.data.text) {
      extractedText = result.data.text
    } else if (result.data && result.data.content) {
      extractedText = result.data.content
    } else if (typeof result.data === "string") {
      extractedText = result.data
    }

    return {
      text: extractedText,
      data: result.data,
    }
  }

  private async extractBasicText(file: File): Promise<string> {
    console.log("Using basic text extraction fallback...")

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text || "")
      }
      reader.onerror = () => {
        console.error("Failed to read file")
        resolve("")
      }
      reader.readAsText(file)
    })
  }

  private evaluateRequirement(
    requirement: JobRequirement,
    applicationData: ApplicationData,
    cvText: string,
    parsedData: any,
  ): { score: number; found: boolean; matches: string[] } {
    const matches: string[] = []
    let found = false

    switch (requirement.type) {
      case "form":
        // Check form fields only
        if (requirement.formFields) {
          for (const field of requirement.formFields) {
            const value = this.getNestedValue(applicationData, field)
            if (value && value.toLowerCase() === "yes") {
              found = true
              matches.push(`Form: ${field} = ${value}`)
            }
          }
        }
        break

      case "numeric":
        // Check numeric values from form
        if (requirement.formFields && requirement.minValue) {
          for (const field of requirement.formFields) {
            const value = this.getNestedValue(applicationData, field)
            const numValue = Number.parseInt(value) || 0
            if (numValue >= requirement.minValue) {
              found = true
              matches.push(`${numValue} years experience`)
            }
          }
        }
        break

      case "keyword":
      default:
        // Check form fields first
        if (requirement.formFields) {
          for (const field of requirement.formFields) {
            const value = this.getNestedValue(applicationData, field)
            if (value && value.toLowerCase() === "yes") {
              found = true
              matches.push(`Form: ${field}`)
            }
          }
        }

        // Then check CV text for keywords
        if (cvText) {
          const lowerCvText = cvText.toLowerCase()
          for (const keyword of requirement.keywords) {
            if (lowerCvText.includes(keyword.toLowerCase())) {
              found = true
              matches.push(keyword)
            }
          }
        }

        // For UAE experience, also check form data
        if (requirement.name === "UAE Experience") {
          const uaeExp = applicationData.personalInfo.uaeExperience
          if (uaeExp && Number.parseInt(uaeExp) > 0) {
            found = true
            matches.push(`${uaeExp} years UAE experience`)
          }
        }
        break
    }

    return {
      score: found ? requirement.weight : 0,
      found,
      matches: matches.slice(0, 10), // Limit matches for display
    }
  }

  private getNestedValue(obj: any, path: string): string {
    const keys = path.split(".")
    let current = obj

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key]
      } else {
        // Try to find in nested objects
        if (current && typeof current === "object") {
          for (const [objKey, objValue] of Object.entries(current)) {
            if (typeof objValue === "object" && objValue !== null && key in objValue) {
              current = (objValue as any)[key]
              break
            }
          }
        }
        if (typeof current !== "string" && typeof current !== "number") {
          return ""
        }
      }
    }

    return String(current || "")
  }
}

// Export both the class and an instance
export { ApplicationScreeningService }
export const screeningService = new ApplicationScreeningService()
