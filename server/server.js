require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const authRoutes = require("./routes/auth.Routes");
const sessionRoutes = require("./routes/session.Routes");
const questionRoutes = require("./routes/question.Routes");
const { protect } = require("./middlewares/auth.Middleware");
const resumeUpload = require("./middlewares/resumeUpload.Middleware");
const {
  generateConceptExplanation,
  generateInterviewQuestion,
  generateResumeBasedQuestions,
} = require("./controller/ai.Controller");

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-question", protect, generateInterviewQuestion);
app.get("/api/ai/generate-question-from-resume", protect, (req, res) => {
  return res.status(405).json({
    message:
      "This endpoint only supports POST requests. Upload your resume and send form data using POST.",
  });
});
app.post(
  "/api/ai/generate-question-from-resume",
  protect,
  resumeUpload.single("resume"),
  generateResumeBasedQuestions,
);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
