"use client"

export interface JobRequirement {
  id: string
  name: string
  weight: number
  type: "exact" | "minimum" | "keywords" | "boolean"
  criteria: {
    field?: string
    value?: string | number
    keywords?: string[]
    minimumValue?: number
  }
}

export interface ScreeningResult {
  score: number
  maxScore: number
  percentage: number
  qualified: boolean
  matchedRequirements: string[]
  missedRequirements: string[]
  feedback: string
}

export class ApplicationScreeningService {
  private jobRequirements: JobRequirement[] = [
    {
      id: "civil_engineering_degree",
      name: "Degree in Civil Engineering",
      weight: 20,
      type: "keywords",
      criteria: {
        field: "cv_content",
        keywords: [
          "civil engineering",
          "civil engineer",
          "engineering degree",
          "bachelor",
          "b.eng",
          "bsc engineering",
          "b.sc engineering",
          "construction engineering",
          "structural engineering",
        ],
      },
    },
    {
      id: "total_experience",
      name: "Total experience ≥ 5 years",
      weight: 20,
      type: "minimum",
      criteria: {
        field: "totalExperience",
        minimumValue: 5,
      },
    },
    {
      id: "project_management_certification",
      name: "Project Management certification",
      weight: 10,
      type: "keywords",
      criteria: {
        field: "cv_content",
        keywords: [
          "pmp",
          "project management professional",
          "prince2",
          "agile certification",
          "scrum master",
          "project management certification",
          "certified project manager",
          "pmbok",
          "project management institute",
        ],
      },
    },
    {
      id: "leadership_communication",
      name: "Leadership & communication skills",
      weight: 15,
      type: "keywords",
      criteria: {
        field: "cv_content",
        keywords: [
          "lead",
          "manage",
          "coordinate",
          "mentor",
          "leadership",
          "team leader",
          "project leader",
          "supervisor",
          "manager",
          "communication",
          "team management",
          "staff management",
          "coordinated",
          "managed team",
          "led project",
        ],
      },
    },
    {
      id: "government_contract_experience",
      name: "Government contract experience",
      weight: 15,
      type: "keywords",
      criteria: {
        field: "cv_content",
        keywords: [
          "government contract",
          "public sector",
          "municipal project",
          "ministry",
          "authority",
          "federal project",
          "state contract",
          "government tender",
          "public works",
          "infrastructure project",
          "road construction",
          "bridge construction",
        ],
      },
    },
    {
      id: "languages",
      name: "Languages (Arabic + English)",
      weight: 10,
      type: "keywords",
      criteria: {
        field: "languages",
        keywords: ["arabic", "english"],
      },
    },
    {
      id: "uae_experience",
      name: "UAE experience",
      weight: 10,
      type: "keywords",
      criteria: {
        field: "uae_experience_combined",
        keywords: [
          // UAE general terms
          "uae",
          "united arab emirates",
          "emirates",
          "middle east",
          "gulf",
          "gcc",
          // Major Emirates and Cities
          "dubai",
          "abu dhabi",
          "sharjah",
          "ajman",
          "fujairah",
          "ras al khaimah",
          "umm al quwain",
          "al ain",
          // Dubai areas
          "deira",
          "bur dubai",
          "jumeirah",
          "marina",
          "downtown dubai",
          "business bay",
          "jlt",
          "jbr",
          "palm jumeirah",
          "dubai mall",
          "burj khalifa",
          "dubai marina",
          "dubai creek",
          // Abu Dhabi areas
          "abu dhabi city",
          "al ain",
          "western region",
          "corniche",
          "saadiyat",
          "yas island",
          "masdar city",
          // Sharjah areas
          "sharjah city",
          "university city",
          "al qasba",
          // Other UAE locations
          "khor fakkan",
          "dibba",
          "kalba",
          "madinat zayed",
          "liwa",
          "al dhafra",
          "ruwais",
          "ghayathi",
          "mirfa",
          "sila",
          "delma",
          // Common UAE project references
          "dubai metro",
          "sheikh zayed road",
          "emirates road",
          "dubai international airport",
          "abu dhabi airport",
          "expo 2020",
          "dubai world trade centre",
          "burj al arab",
          "atlantis",
          "dubai fountain",
          "ferrari world",
          "louvre abu dhabi",
          "dubai frame",
          "ain dubai",
          "global village",
          "miracle garden",
          "dubai parks",
          "img worlds",
          "dubai opera",
          "dubai design district",
          "dubai healthcare city",
          "dubai internet city",
          "dubai media city",
          "dubai knowledge park",
          "dubai silicon oasis",
          "dubai south",
          "al maktoum airport",
          "jebel ali",
          "port rashid",
          "dubai ports",
          "adnoc",
          "etisalat",
          "du telecom",
          "emirates airline",
          "flydubai",
          "dubai electricity",
          "dewa",
          "addc",
          "sewa",
          "fewa",
        ],
      },
    },
  ]

  private qualificationThreshold = 50 // Changed from 0 to 50 - only submit to Odoo if >= 50%

  async screenApplication(applicationData: any, cvContent?: string): Promise<ScreeningResult> {
    console.log("🔍 Starting application screening...")

    let totalScore = 0
    let maxScore = 0
    const matchedRequirements: string[] = []
    const missedRequirements: string[] = []

    for (const requirement of this.jobRequirements) {
      maxScore += requirement.weight
      const isMatched = this.evaluateRequirement(requirement, applicationData, cvContent)

      if (isMatched) {
        totalScore += requirement.weight
        matchedRequirements.push(requirement.name)
        console.log(`✅ Matched: ${requirement.name} (${requirement.weight} points)`)
      } else {
        missedRequirements.push(requirement.name)
        console.log(`❌ Missed: ${requirement.name} (${requirement.weight} points)`)
      }
    }

    const percentage = Math.round((totalScore / maxScore) * 100)
    // Changed from: percentage >= this.qualificationThreshold
    const qualified = percentage >= this.qualificationThreshold

    const result: ScreeningResult = {
      score: totalScore,
      maxScore,
      percentage,
      qualified,
      matchedRequirements,
      missedRequirements,
      feedback: this.generateFeedback(qualified, percentage, matchedRequirements, missedRequirements),
    }

    console.log(
      `📊 Screening Result: ${percentage}% (${totalScore}/${maxScore}) - ${qualified ? "WILL SUBMIT TO ODOO" : "WILL NOT SUBMIT TO ODOO (Below 50%)"}`,
    )

    return result
  }

  private evaluateRequirement(requirement: JobRequirement, applicationData: any, cvContent?: string): boolean {
    const { type, criteria } = requirement

    switch (type) {
      case "minimum":
        return this.evaluateMinimumRequirement(criteria, applicationData)

      case "keywords":
        return this.evaluateKeywordRequirement(criteria, applicationData, cvContent)

      case "exact":
        return this.evaluateExactRequirement(criteria, applicationData)

      case "boolean":
        return this.evaluateBooleanRequirement(criteria, applicationData)

      default:
        return false
    }
  }

  private evaluateMinimumRequirement(criteria: any, applicationData: any): boolean {
    const fieldValue = this.getFieldValue(criteria.field, applicationData)
    if (!fieldValue) return false

    // Extract numeric value from experience strings like "5 years", "5-7 years", "More than 5 years"
    const numericValue = this.extractNumericValue(fieldValue.toString())
    return numericValue >= (criteria.minimumValue || 0)
  }

  private evaluateKeywordRequirement(criteria: any, applicationData: any, cvContent?: string): boolean {
    const keywords = criteria.keywords || []
    let searchText = ""

    // Get field value
    if (criteria.field === "cv_content" && cvContent) {
      searchText = cvContent.toLowerCase()
    } else if (criteria.field === "languages") {
      // Handle languages array
      const languages = applicationData?.languages || []
      if (Array.isArray(languages)) {
        searchText = languages
          .map((lang: any) => (typeof lang === "string" ? lang : lang.language || ""))
          .join(" ")
          .toLowerCase()
      }
    } else if (criteria.field === "uae_experience_combined") {
      // Combine UAE experience from form data and CV content
      const formUAEExp = this.getFieldValue("uaeExperience", applicationData) || ""
      const cvUAEContent = cvContent || ""
      searchText = (formUAEExp + " " + cvUAEContent).toLowerCase()
      console.log("🇦🇪 UAE Experience search text:", searchText.substring(0, 200) + "...")
    } else if (criteria.field === "experience_details") {
      // Combine experience-related fields
      const experienceData = applicationData?.experienceData || {}
      searchText = Object.values(experienceData).join(" ").toLowerCase()
    } else {
      const fieldValue = this.getFieldValue(criteria.field, applicationData)
      searchText = fieldValue ? fieldValue.toString().toLowerCase() : ""
    }

    // Check if any keyword matches
    const matchedKeywords = keywords.filter((keyword: string) => searchText.includes(keyword.toLowerCase()))

    if (matchedKeywords.length > 0 && criteria.field === "uae_experience_combined") {
      console.log("🇦🇪 UAE Experience matched keywords:", matchedKeywords)
    }

    return matchedKeywords.length > 0
  }

  private evaluateExactRequirement(criteria: any, applicationData: any): boolean {
    const fieldValue = this.getFieldValue(criteria.field, applicationData)
    return fieldValue === criteria.value
  }

  private evaluateBooleanRequirement(criteria: any, applicationData: any): boolean {
    const fieldValue = this.getFieldValue(criteria.field, applicationData)
    return Boolean(fieldValue)
  }

  private getFieldValue(fieldPath: string, applicationData: any): any {
    // Handle nested field paths like 'formData.email'
    const paths = fieldPath.split(".")
    let value = applicationData

    for (const path of paths) {
      if (value && typeof value === "object") {
        value = value[path] || value.formData?.[path]
      } else {
        return null
      }
    }

    return value
  }

  private extractNumericValue(text: string): number {
    // Extract numbers from text like "5 years", "5-7 years", "More than 5 years"
    const matches = text.match(/(\d+)/g)
    if (matches && matches.length > 0) {
      return Number.parseInt(matches[0], 10)
    }
    return 0
  }

  private generateFeedback(qualified: boolean, percentage: number, matched: string[], missed: string[]): string {
    if (qualified) {
      return `Congratulations! Your profile shows a strong ${percentage}% match with our requirements. Your application has been submitted to our HR team for review. ${matched.length > 0 ? `Your key strengths include: ${matched.slice(0, 3).join(", ")}.` : ""} You will be contacted if your profile is selected for the next round.`
    } else {
      return `Thank you for your interest! Your profile shows a ${percentage}% match with our requirements. While we appreciate your application, we require at least a 50% match for this position. ${matched.length > 0 ? `We did note your strengths in: ${matched.slice(0, 2).join(", ")}.` : ""} Please feel free to apply for other positions that better match your qualifications.`
    }
  }

  async extractCVContent(cvFile: File): Promise<string> {
    try {
      console.log("🤖 Extracting CV content using fallback method:", cvFile.name, cvFile.type)
      return await this.fallbackCVExtraction(cvFile)
    } catch (error) {
      console.error("❌ Error in CV extraction:", error)
      return ""
    }
  }

  // Fallback CV extraction for when Parsee.ai fails
  private async fallbackCVExtraction(cvFile: File): Promise<string> {
    try {
      console.log("🔄 Using fallback CV extraction for:", cvFile.name, cvFile.type)

      if (cvFile.type === "text/plain") {
        const text = await cvFile.text()
        return this.enhanceTextExtraction(text)
      } else if (cvFile.type === "application/pdf") {
        console.log("PDF parsing - using basic text extraction")
        try {
          const arrayBuffer = await cvFile.arrayBuffer()
          const text = new TextDecoder().decode(arrayBuffer)
          const extractedText = this.extractTextFromPDFContent(text)
          return this.enhanceTextExtraction(extractedText)
        } catch (error) {
          console.log("PDF text extraction failed, using filename analysis")
          return this.analyzeFileName(cvFile.name)
        }
      } else if (
        cvFile.type === "application/msword" ||
        cvFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        console.log("Word document parsing - using basic text extraction")
        try {
          const text = await cvFile.text()
          return this.enhanceTextExtraction(text)
        } catch (error) {
          console.log("Word document text extraction failed, using filename analysis")
          return this.analyzeFileName(cvFile.name)
        }
      } else {
        console.log("Unsupported file type for CV parsing:", cvFile.type)
        return this.analyzeFileName(cvFile.name)
      }
    } catch (error) {
      console.error("Error in fallback CV extraction:", error)
      return ""
    }
  }

  // Helper method to enhance text extraction with keyword detection
  private enhanceTextExtraction(text: string): string {
    if (!text) return ""

    // Clean and normalize the text
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // Add common variations and synonyms for better matching
    const enhancedText = cleanText + " " + this.addKeywordVariations(cleanText)

    return enhancedText
  }

  // Helper method to extract text from PDF content
  private extractTextFromPDFContent(pdfContent: string): string {
    // Basic PDF text extraction - look for readable text patterns
    const textMatches = pdfContent.match(/[a-zA-Z\s]{10,}/g) || []
    return textMatches.join(" ").toLowerCase()
  }

  // Helper method to analyze filename for keywords
  private analyzeFileName(filename: string): string {
    const nameKeywords = filename
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)

    return nameKeywords.join(" ")
  }

  // Helper method to add keyword variations for better matching
  private addKeywordVariations(text: string): string {
    const variations: Record<string, string[]> = {
      engineer: ["engineering", "eng", "technical"],
      manager: ["management", "mgr", "lead", "supervisor"],
      project: ["proj", "construction", "building"],
      experience: ["exp", "years", "work"],
      civil: ["construction", "structural", "infrastructure"],
      government: ["govt", "public", "municipal", "federal"],
      uae: ["emirates", "dubai", "abu dhabi", "middle east", "gulf", "gcc"],
      arabic: ["arab", "middle eastern"],
      leadership: ["lead", "manage", "supervise", "coordinate"],
      dubai: ["dxb", "emirates", "uae"],
      sharjah: ["shj", "emirates", "uae"],
      "abu dhabi": ["auh", "capital", "emirates", "uae"],
    }

    let additionalKeywords = ""

    for (const [key, synonyms] of Object.entries(variations)) {
      if (text.includes(key)) {
        additionalKeywords += " " + synonyms.join(" ")
      }
    }

    return additionalKeywords
  }

  // Method to update job requirements dynamically
  updateJobRequirements(newRequirements: JobRequirement[]): void {
    this.jobRequirements = newRequirements
  }

  // Method to update qualification threshold
  updateQualificationThreshold(threshold: number): void {
    this.qualificationThreshold = threshold
  }

  // Get current requirements (for admin interface)
  getJobRequirements(): JobRequirement[] {
    return [...this.jobRequirements]
  }
}

// Export the service instance as a named export
export const screeningService = new ApplicationScreeningService()
