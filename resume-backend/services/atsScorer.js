// ======================================
// PROFESSIONAL ATS SCORE CALCULATOR
// ======================================
//
// MODE 1:
// General Resume ATS Score
//
// MODE 2:
// Job-specific ATS Score
//
// JOB-SPECIFIC SCORE = 100
//
// Skills Match          = 35
// Keyword Match         = 20
// Resume Sections       = 15
// ATS Parsability       = 10
// Experience Relevance  = 10
// Education             = 5
// Projects / Quality    = 5
// ======================================

const calculateATSScore = ({
  jobSkills = [],
  resumeSkills = [],
  experience = [],
  education = [],
  projects = [],
  resumeText = "",
}) => {
  // ======================================
  // NORMALIZE
  // ======================================

  const normalizeArray = (arr) => [
    ...new Set(
      (Array.isArray(arr) ? arr : [])
        .filter(Boolean)
        .map((item) =>
          String(item).toLowerCase().trim()
        )
        .filter(Boolean)
    ),
  ];

  const normalizedJobSkills =
    normalizeArray(jobSkills);

  const normalizedResumeSkills =
    normalizeArray(resumeSkills);

  const text =
    typeof resumeText === "string"
      ? resumeText.toLowerCase().trim()
      : "";

  // ======================================
  // HELPER
  // ======================================

  const containsAny = (keywords) =>
    keywords.some((keyword) =>
      text.includes(keyword)
    );

  // ======================================
  // MODE 1
  // GENERAL RESUME ATS SCORE
  // ======================================

  if (normalizedJobSkills.length === 0) {
    // --------------------------------------
    // SKILLS - 50
    // --------------------------------------

    let skillScore = 0;

    const skillCount =
      normalizedResumeSkills.length;

    if (skillCount >= 10) {
      skillScore = 50;
    } else if (skillCount > 0) {
      skillScore = Math.round(
        (skillCount / 10) * 50
      );
    }

    // --------------------------------------
    // EXPERIENCE - 20
    // --------------------------------------

    let experienceScore = 0;

    if (
      Array.isArray(experience) &&
      experience.length > 0
    ) {
      experienceScore = 20;
    } else if (
      containsAny([
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "internship",
        "intern",
      ])
    ) {
      experienceScore = 20;
    }

    // --------------------------------------
    // EDUCATION - 10
    // --------------------------------------

    let educationScore = 0;

    if (
      Array.isArray(education) &&
      education.length > 0
    ) {
      educationScore = 10;
    } else if (
      containsAny([
        "education",
        "b.tech",
        "btech",
        "b.e",
        "bachelor",
        "master",
        "m.tech",
        "mtech",
        "mca",
        "degree",
        "university",
        "college",
        "cgpa",
        "gpa",
      ])
    ) {
      educationScore = 10;
    }

    // --------------------------------------
    // PROJECTS - 10
    // --------------------------------------

    let projectScore = 0;

    if (
      Array.isArray(projects) &&
      projects.length > 0
    ) {
      projectScore = 10;
    } else if (
      containsAny([
        "project",
        "projects",
        "github",
        "portfolio",
        "developed",
        "built",
        "implemented",
      ])
    ) {
      projectScore = 10;
    }

    // --------------------------------------
    // RESUME QUALITY - 10
    // --------------------------------------

    let resumeQualityScore = 0;

    if (text.length >= 1500) {
      resumeQualityScore = 10;
    } else if (text.length >= 1000) {
      resumeQualityScore = 8;
    } else if (text.length >= 700) {
      resumeQualityScore = 6;
    } else if (text.length >= 400) {
      resumeQualityScore = 4;
    } else if (text.length >= 200) {
      resumeQualityScore = 2;
    }

    const atsScore = Math.min(
      100,
      Math.round(
        skillScore +
          experienceScore +
          educationScore +
          projectScore +
          resumeQualityScore
      )
    );

    return {
      atsScore,

      skillScore,

      experienceScore,

      educationScore,

      projectScore,

      resumeQualityScore,

      keywordScore: 0,

      sectionScore: 0,

      atsParsabilityScore: 0,

      matchedSkills: [],

      missingSkills: [],

      matchedKeywords: [],

      missingKeywords: [],
    };
  }

  // ======================================
  // MODE 2
  // JOB-SPECIFIC ATS
  // ======================================

  // ======================================
  // 1. SKILLS MATCH - 35
  // ======================================

  const matchedSkills =
    normalizedJobSkills.filter((skill) =>
      normalizedResumeSkills.includes(skill)
    );

  const missingSkills =
    normalizedJobSkills.filter(
      (skill) =>
        !normalizedResumeSkills.includes(skill)
    );

  let skillScore = 0;

  if (normalizedJobSkills.length > 0) {
    skillScore =
      (matchedSkills.length /
        normalizedJobSkills.length) *
      35;
  }

  // ======================================
  // 2. KEYWORD MATCH - 20
  // ======================================
  //
  // Job skills are also treated as important
  // JD keywords.
  //
  // This additionally checks whether the
  // skill appears directly in resume text.
  // ======================================

  const matchedKeywords =
    normalizedJobSkills.filter((keyword) =>
      text.includes(keyword)
    );

  const missingKeywords =
    normalizedJobSkills.filter(
      (keyword) =>
        !text.includes(keyword)
    );

  let keywordScore = 0;

  if (normalizedJobSkills.length > 0) {
    keywordScore =
      (matchedKeywords.length /
        normalizedJobSkills.length) *
      20;
  }

  // ======================================
  // 3. RESUME SECTIONS - 15
  // ======================================

  const sections = {
    summary: containsAny([
      "summary",
      "professional summary",
      "profile",
      "objective",
    ]),

    experience: containsAny([
      "experience",
      "work experience",
      "professional experience",
      "employment",
      "internship",
    ]),

    education: containsAny([
      "education",
      "b.tech",
      "btech",
      "bachelor",
      "degree",
      "university",
      "college",
    ]),

    skills: containsAny([
      "skills",
      "technical skills",
      "technical skill",
    ]),

    projects: containsAny([
      "projects",
      "project",
      "github",
      "portfolio",
    ]),
  };

  const sectionCount =
    Object.values(sections).filter(Boolean).length;

  // 5 sections × 3 points = 15
  const sectionScore =
    sectionCount * 3;

  // ======================================
  // 4. ATS PARSABILITY - 10
  // ======================================

  let atsParsabilityScore = 0;

  if (text.length >= 1500) {
    atsParsabilityScore = 10;
  } else if (text.length >= 1000) {
    atsParsabilityScore = 9;
  } else if (text.length >= 700) {
    atsParsabilityScore = 7;
  } else if (text.length >= 400) {
    atsParsabilityScore = 5;
  } else if (text.length >= 200) {
    atsParsabilityScore = 3;
  }

  // Additional parsing checks
  const hasEmail =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
      text
    );

  const hasPhone =
    /\b\d{10}\b/.test(
      text.replace(/\D/g, "")
    );

  if (hasEmail && hasPhone) {
    atsParsabilityScore = Math.min(
      10,
      atsParsabilityScore + 1
    );
  }

  // ======================================
  // 5. EXPERIENCE RELEVANCE - 10
  // ======================================

  let experienceScore = 0;

  const hasExperienceData =
    Array.isArray(experience) &&
    experience.length > 0;

  const hasExperienceText =
    containsAny([
      "experience",
      "work experience",
      "professional experience",
      "internship",
      "intern",
    ]);

  if (hasExperienceData) {
    experienceScore = 10;
  } else if (hasExperienceText) {
    experienceScore = 6;
  }

  // If resume contains matched job skills
  // inside experience-related text, add value.
  if (
    experienceScore > 0 &&
    matchedSkills.length > 0
  ) {
    experienceScore = Math.min(
      10,
      experienceScore + 2
    );
  }

  // ======================================
  // 6. EDUCATION - 5
  // ======================================

  let educationScore = 0;

  if (
    Array.isArray(education) &&
    education.length > 0
  ) {
    educationScore = 5;
  } else if (
    containsAny([
      "education",
      "b.tech",
      "btech",
      "b.e",
      "bachelor",
      "degree",
      "university",
      "college",
    ])
  ) {
    educationScore = 4;
  }

  // ======================================
  // 7. PROJECTS / QUALITY - 5
  // ======================================

  let projectQualityScore = 0;

  const hasProjects =
    Array.isArray(projects) &&
    projects.length > 0;

  const hasProjectText =
    containsAny([
      "project",
      "projects",
      "github",
      "portfolio",
      "developed",
      "built",
      "implemented",
    ]);

  if (hasProjects) {
    projectQualityScore = 5;
  } else if (hasProjectText) {
    projectQualityScore = 4;
  }

  // ======================================
  // FINAL SCORE
  // ======================================

  const atsScore = Math.min(
    100,
    Math.round(
      skillScore +
        keywordScore +
        sectionScore +
        atsParsabilityScore +
        experienceScore +
        educationScore +
        projectQualityScore
    )
  );

  // ======================================
  // RETURN
  // ======================================

  return {
    atsScore,

    skillScore: Math.round(skillScore),

    keywordScore: Math.round(keywordScore),

    sectionScore,

    atsParsabilityScore,

    experienceScore,

    educationScore,

    projectQualityScore,

    // Keep old field for compatibility
    projectScore: projectQualityScore,

    // Keep old field for compatibility
    resumeQualityScore: atsParsabilityScore,

    matchedSkills,

    missingSkills,

    matchedKeywords,

    missingKeywords,
  };
};

// ======================================
// EXPORT
// ======================================

module.exports = {
  calculateATSScore,
};