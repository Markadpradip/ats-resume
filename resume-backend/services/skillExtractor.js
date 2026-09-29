// ======================================
// SKILL DATABASE
// ======================================

const SKILL_LIST = [
  // Programming Languages
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "c++",
  "c#",
  "go",
  "golang",
  "rust",
  "kotlin",
  "swift",
  "dart",
  "ruby",
  "php",
  "scala",
  "perl",
  "lua",
  "bash",
  "powershell",

  // Frontend
  "html",
  "html5",
  "css",
  "css3",
  "sass",
  "scss",
  "less",
  "react",
  "react.js",
  "angular",
  "vue",
  "vue.js",
  "next.js",
  "nuxt.js",
  "svelte",
  "jquery",
  "bootstrap",
  "tailwind",
  "tailwind css",
  "material ui",
  "mui",
  "redux",
  "redux toolkit",
  "zustand",

  // Backend
  "node",
  "node.js",
  "express",
  "express.js",
  "nestjs",
  "nest.js",
  "spring",
  "spring boot",
  "django",
  "flask",
  "fastapi",
  "laravel",
  "asp.net",
  ".net",
  "dotnet",

  // Database
  "mongodb",
  "mongoose",
  "mysql",
  "postgresql",
  "postgres",
  "oracle",
  "sql server",
  "sqlite",
  "redis",
  "firebase",
  "dynamodb",
  "cassandra",
  "elasticsearch",

  // API / Web
  "rest api",
  "restful api",
  "graphql",
  "websocket",
  "json",
  "xml",
  "oauth",
  "jwt",

  // DevOps / Cloud
  "git",
  "github",
  "gitlab",
  "bitbucket",
  "docker",
  "kubernetes",
  "jenkins",
  "ci/cd",
  "aws",
  "azure",
  "google cloud",
  "gcp",
  "vercel",
  "netlify",
  "render",

  // AI / ML / Data
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "pandas",
  "numpy",
  "opencv",
  "matplotlib",
  "seaborn",
  "jupyter",

  // Tools
  "postman",
  "swagger",
  "figma",
  "visual studio code",
  "vs code",
  "npm",
  "yarn",
  "pnpm",
  "webpack",
  "vite",

  // Testing
  "jest",
  "mocha",
  "chai",
  "cypress",
  "selenium",
  "playwright",

  // Mobile
  "react native",
  "flutter",
  "android",
  "android studio",
  "ios",
  "xcode",

  // Concepts
  "microservices",
  "mvc",
  "oop",
  "data structures",
  "algorithms",
  "dsa"
];

// ======================================
// TECHNICAL SKILLS SECTION HEADINGS
// ======================================

const SKILL_SECTION_HEADINGS = [
  "technical skills",
  "technical skill",
  "skills",
  "skills & technologies",
  "skills and technologies",
  "technical expertise",
  "core skills",
  "programming skills",
  "technologies",
  "tech stack",
  "tools & technologies",
  "tools and technologies"
];

// ======================================
// OTHER RESUME SECTION HEADINGS
// These sections should NOT be treated as
// technical skills.
// ======================================

const OTHER_SECTION_HEADINGS = [
  "experience",
  "work experience",
  "professional experience",
  "employment",
  "education",
  "projects",
  "personal projects",
  "certifications",
  "certification",
  "achievements",
  "awards",
  "summary",
  "professional summary",
  "career summary",
  "objective",
  "career objective",
  "interests",
  "hobbies",
  "languages",
  "references",
  "declaration",
  "contact",
  "personal details"
];

// ======================================
// NORMALIZE TEXT
// ======================================

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
};

// ======================================
// FIND TECHNICAL SKILLS SECTION
// ======================================

const extractTechnicalSkillsSection = (resumeText) => {
  const text = normalizeText(resumeText);

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let startIndex = -1;

  // Find Technical Skills heading
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      SKILL_SECTION_HEADINGS.some(
        (heading) =>
          line === heading ||
          line.startsWith(heading + ":")
      )
    ) {
      startIndex = i;
      break;
    }
  }

  // Technical Skills section not found
  if (startIndex === -1) {
    return "";
  }

  const skillLines = [];

  for (
    let i = startIndex + 1;
    i < lines.length;
    i++
  ) {
    const line = lines[i];

    // Stop when another major section starts
    const isOtherSection = OTHER_SECTION_HEADINGS.some(
      (heading) =>
        line === heading ||
        line.startsWith(heading + ":")
    );

    if (isOtherSection) {
      break;
    }

    skillLines.push(line);
  }

  return skillLines.join(" ");
};

// ======================================
// EXTRACT SKILLS
// ======================================

const extractSkills = (resumeText) => {
  if (!resumeText) {
    return [];
  }

  const technicalSkillsText =
    extractTechnicalSkillsSection(resumeText);

  if (!technicalSkillsText) {
    return [];
  }

  const foundSkills = [];

  SKILL_LIST.forEach((skill) => {
    const escapedSkill = skill.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(
      `(^|[^a-zA-Z0-9+#.-])${escapedSkill}([^a-zA-Z0-9+#.-]|$)`,
      "i"
    );

    if (regex.test(technicalSkillsText)) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};


// ======================================
// EXPORT
// ======================================
const SKILL_ALIASES = {
  react: "react.js",
  "react.js": "react.js",

  node: "node.js",
  "node.js": "node.js",

  express: "express.js",
  "express.js": "express.js",

  mongo: "mongodb",
  mongodb: "mongodb",

  postgres: "postgresql",
  postgresql: "postgresql",

  tailwind: "tailwind css",
  "tailwind css": "tailwind css",

  vue: "vue.js",
  "vue.js": "vue.js",

  rest: "rest api",
  "rest api": "rest api",
};

const normalizeSkill = (skill) => {
  const normalized = skill.toLowerCase().trim();

  return SKILL_ALIASES[normalized] || normalized;
};

const normalizeSkills = (skills) => {
  return [
    ...new Set(
      skills.map((skill) => normalizeSkill(skill))
    ),
  ];
};

module.exports = {
  extractSkills,
  extractTechnicalSkillsSection,
  normalizeSkill,
  normalizeSkills,
  SKILL_LIST,
};