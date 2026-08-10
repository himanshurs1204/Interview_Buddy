const stopWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "if",
  "then",
  "else",
  "for",
  "with",
  "without",
  "of",
  "to",
  "in",
  "on",
  "at",
  "by",
  "from",
  "as",
  "is",
  "it",
  "its",
  "be",
  "are",
  "was",
  "were",
  "this",
  "that",
  "these",
  "those",
  "into",
  "about",
  "after",
  "before",
  "through",
  "between",
  "over",
  "under",
  "up",
  "down",
  "your",
  "you",
  "our",
  "we",
  "they",
  "them",
  "their",
  "his",
  "her",
  "she",
  "he",
  "i",
  "me",
  "my",
  "mine",
  "us",
  "who",
  "what",
  "when",
  "where",
  "why",
  "how",
  "can",
  "could",
  "should",
  "would",
  "will",
  "did",
  "do",
  "done",
  "has",
  "have",
  "had",
  "not",
  "very",
  "more",
  "most",
  "some",
  "any",
  "all",
  "each",
  "such",
  "work",
  "works",
  "working",
  "using",
  "used",
  "based",
  "build",
  "built",
  "team",
  "teams",
  "experience",
  "experienced",
  "skills",
  "skill",
  "projects",
  "project",
  "role",
  "roles",
  "resume",
  "candidate",
  "candidates",
  "developer",
  "engineer",
  "technical",
  "strong",
  "good",
  "excellent",
  "include",
  "includes",
  "including",
  "helped",
  "along",
  "also",
  "like",
  "within",
  "across",
  "during",
  "year",
  "years",
  "month",
  "months",
]);

const normalizeKeyword = (keyword) => {
  return String(keyword)
    .toLowerCase()
    .replace(/[^a-z0-9.+/#\-\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const extractKeywordsFromText = (resumeText) => {
  if (!resumeText || !String(resumeText).trim()) {
    return [];
  }

  const cleanedText = String(resumeText).replace(/\s+/g, " ").trim();

  const words =
    cleanedText.match(/[A-Za-z][A-Za-z0-9.+/#-]*(?:\.[A-Za-z0-9.+/#-]+)*/g) ||
    [];
  const keywordMap = new Map();

  for (const word of words) {
    const normalized = normalizeKeyword(word);
    if (!normalized || normalized.length < 2 || stopWords.has(normalized)) {
      continue;
    }

    if (normalized.includes("http") || normalized.includes("www")) {
      continue;
    }

    if (!keywordMap.has(normalized)) {
      keywordMap.set(normalized, 1);
    } else {
      keywordMap.set(normalized, keywordMap.get(normalized) + 1);
    }
  }

  return [...keywordMap.entries()]
    .filter(([_, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, 12);
};

const buildResumeQuestionPrompt = ({
  keywords = [],
  role = "Candidate",
  experience = "relevant experience",
  numberOfQuestions = 10,
}) => {
  const keywordList = keywords.length
    ? keywords.join(", ")
    : "core product and engineering concepts";
  const questionCount = Number(numberOfQuestions) || 10;

  return `
    You are an AI trained to generate technical interview questions from a candidate's resume.

    Task:
    - Candidate role: ${role}
    - Candidate experience: ${experience}
    - Resume keywords/topics: ${keywordList}
    - Write ${questionCount} interview questions.
    - Keep the questions aligned to the resume topics and the candidate experience level.
    - For each question, add a clear, detailed but beginner-friendly answer.
    - Mix practical, behavioral, and technical questions where relevant.
    - If an answer includes a code example, include a short code block inside the answer.
    - Return a pure JSON array like:
    [
      {
        "question": "Question here?",
        "answer": "Answer here."
      }
    ]
    Important: Do NOT add any extra text outside of valid JSON.
  `;
};

module.exports = {
  extractKeywordsFromText,
  buildResumeQuestionPrompt,
};
