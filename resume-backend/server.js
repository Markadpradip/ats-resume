const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");
const path = require("path");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const atsRoutes = require("./routes/atsRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recruiterDashboardRoutes = require("./routes/recruiterDashboardRoutes");
const candidateDashboardRoutes = require("./routes/candidateDashboardRoutes");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

dotenv.config();
validateEnv();
// ======================================
// DATABASE
// ======================================

connectDB();

// ======================================
// EXPRESS APP
// ======================================

const app = express();


// ======================================
// SECURITY HEADERS
// ======================================

app.use(helmet());

// ======================================
// CORS
// ======================================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);
// ======================================
// BODY PARSER
// ======================================

app.use(express.json());
// ======================================
// SERVE UPLOADED RESUME FILES
// ======================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(express.urlencoded({ extended: true }));

// ======================================
// GENERAL API RATE LIMITER
// ======================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 200,

  standardHeaders: true,

  legacyHeaders: false,

  // Auth routes have their own stricter limiter
  skip: (req) => {
    return req.path.startsWith("/auth");
  },

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

// ======================================
// AUTH RATE LIMITER
// ======================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

// ======================================
// APPLY GENERAL API LIMITER
// ======================================

app.use("/api", apiLimiter);

// ======================================
// ROOT ROUTE
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to AI ATS Backend API",
  });
});

// ======================================
// HEALTH
// ======================================

app.use("/api/health", healthRoutes);

// ======================================
// AUTH
// ======================================

app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);

// ======================================
// CANDIDATE
// ======================================

app.use(
  "/api/candidates",
  candidateRoutes
);

// ======================================
// RECRUITER
// ======================================

app.use(
  "/api/recruiters",
  recruiterRoutes
);

// ======================================
// ADMIN
// ======================================

app.use(
  "/api/admin",
  adminRoutes
);

// ======================================
// JOBS
// ======================================

app.use(
  "/api/jobs",
  jobRoutes
);

// ======================================
// APPLICATIONS
// ======================================

app.use(
  "/api/applications",
  applicationRoutes
);

// ======================================
// ATS
// ======================================

app.use(
  "/api/ats",
  atsRoutes
);

// ======================================
// CANDIDATE DASHBOARD
// ======================================

app.use(
  "/api/candidate/dashboard",
  candidateDashboardRoutes
);

// ======================================
// RECRUITER DASHBOARD
// ======================================

app.use(
  "/api/recruiter/dashboard",
  recruiterDashboardRoutes
);

// ======================================
// MULTER / UPLOAD ERROR HANDLER
// IMPORTANT:
// This must come BEFORE notFound/errorHandler
// ======================================

app.use((err, req, res, next) => {
  if (err) {
    // File too large
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "Resume file size must not exceed 5 MB",
      });
    }

    // Invalid file type
    if (
      err.message ===
      "Only PDF files are allowed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only PDF files are allowed",
      });
    }
  }

  next(err);
});

// ======================================
// 404 NOT FOUND
// ======================================

app.use(notFound);

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use(errorHandler);

// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

// ======================================
// GRACEFUL SHUTDOWN
// ======================================

const gracefulShutdown = async (
  signal
) => {
  console.log(
    `${signal} received. Shutting down gracefully...`
  );

  server.close(async () => {
    try {
      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Error closing MongoDB:",
        error.message
      );

      process.exit(1);
    }
  });
};

process.on(
  "SIGINT",
  () => gracefulShutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => gracefulShutdown("SIGTERM")
);