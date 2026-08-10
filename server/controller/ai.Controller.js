const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");
const prompts = require("../utils/prompts.js");
const {
  extractKeywordsFromText,
  buildResumeQuestionPrompt,
} = require("../utils/resumeUtils.js");
const { conceptExplainPrompt, questionAnswerPrompt } = prompts;

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

const getGeminiErrorDetails = (error) => {
  const rawMessage =
    error?.message || error?.toString?.() || "Unknown Gemini error";
  const text = String(rawMessage);

  if (
    /quota|resource_exhausted|429|rate limit|exceeded your current quota/i.test(
      text,
    )
  ) {
    return {
      status: 429,
      message:
        "Gemini API quota has been exhausted. Please add billing or use a project with available quota.",
      details: text,
    };
  }

  if (
    /api key|invalid api|unauthenticated|authentication|forbidden/i.test(text)
  ) {
    return {
      status: 401,
      message: "Gemini API authentication failed. Please check the API key.",
      details: text,
    };
  }

  if (/model|bad request|invalid request|not found/i.test(text)) {
    return {
      status: 400,
      message:
        "The Gemini request was invalid. Please check the selected model or payload.",
      details: text,
    };
  }

  return {
    status: 500,
    message: "Failed to generate the questions from Gemini.",
    details: text,
  };
};

const parseGeminiJson = (responseText) => {
  if (!responseText) {
    throw new Error("Empty response from Gemini");
  }

  const cleanText = String(responseText)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanText);
};

const generateWithGemini = async (
  prompt,
  systemInstruction = "You are an expert interview assistant. Respond in JSON format only.",
) => {
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: systemInstruction,
    },
  });

  const text =
    response?.text ||
    response?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("") ||
    "";
  return parseGeminiJson(text);
};

const extractResumeText = async (resumeFile, resumeText) => {
  if (resumeText && String(resumeText).trim()) {
    return resumeText;
  }

  if (!resumeFile) {
    throw new Error("Resume file is required");
  }

  const fileBuffer = resumeFile.buffer || fs.readFileSync(resumeFile.path);
  const filename = (resumeFile.originalname || "").toLowerCase();
  const mimetype = resumeFile.mimetype || "";

  if (mimetype === "application/pdf" || filename.endsWith(".pdf")) {
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text || "";
  }

  if (
    mimetype.includes("word") ||
    filename.endsWith(".docx") ||
    filename.endsWith(".doc")
  ) {
    if (filename.endsWith(".docx") || mimetype.includes("officedocument")) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value || "";
    }

    return fileBuffer.toString("utf8").replace(/\0/g, " ");
  }

  return fileBuffer.toString("utf8");
};

// @description   Genrate Interview question and answers using Gemini
// @route          POST  /api/ai/generate-question
// @access         Private

const generateInterviewQuestion = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Misssing required filds" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    );

    const data = await generateWithGemini(
      prompt,
      "You are an expert interview question generator. Respond in JSON format only.",
    );

    res.status(200).json(data);
  } catch (error) {
    const aiError = getGeminiErrorDetails(error);
    return res.status(aiError.status).json({
      message: aiError.message,
      error: aiError.details,
    });
  }
};

// @description   Generate the explaination of a interview question
// @route          POST  /api/ai/generate-question
// @access         Private

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Misssing required filds" });
    }

    const prompt = conceptExplainPrompt(question);
    const data = await generateWithGemini(
      prompt,
      "You are an expert interview concept explainer. Respond in JSON format only.",
    );

    res.status(200).json(data);
  } catch (error) {
    const aiError = getGeminiErrorDetails(error);
    return res.status(aiError.status).json({
      message: aiError.message,
      error: aiError.details,
    });
  }
};

const generateResumeBasedQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      topicsToFocus,
      description,
      resumeText,
      numberOfQuestions,
    } = req.body;
    const resumeFile = req.file;

    if (!resumeFile && !resumeText) {
      return res
        .status(400)
        .json({ message: "Please upload a resume or provide resume text." });
    }

    const extractedText = await extractResumeText(resumeFile, resumeText);
    const keywords = extractKeywordsFromText(extractedText);

    const prompt = buildResumeQuestionPrompt({
      keywords: keywords.length
        ? keywords
        : topicsToFocus
          ? topicsToFocus
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      role: role || "Resume-based candidate",
      experience: experience || "relevant experience",
      numberOfQuestions: Number(numberOfQuestions) || 10,
    });

    const data = await generateWithGemini(
      prompt,
      "You are an expert interview question generator. Respond in JSON format only.",
    );

    res.status(200).json({
      ...data,
      keywords,
    });
  } catch (error) {
    const aiError = getGeminiErrorDetails(error);
    return res.status(aiError.status).json({
      message: aiError.message,
      error: aiError.details,
    });
  }
};

module.exports = {
  generateConceptExplanation,
  generateInterviewQuestion,
  generateResumeBasedQuestions,
};
