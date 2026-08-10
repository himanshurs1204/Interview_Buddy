const test = require("node:test");
const assert = require("node:assert/strict");
const {
  extractKeywordsFromText,
  buildResumeQuestionPrompt,
} = require("../utils/resumeUtils");

test("extractKeywordsFromText keeps important resume terms", () => {
  const text = `
    Senior Full Stack Engineer with 5 years experience in React, Node.js, Express, MongoDB, AWS, Docker, CI/CD,
    and leadership in agile teams. Built scalable APIs and microservices using JavaScript and TypeScript.
  `;

  const keywords = extractKeywordsFromText(text);

  assert.ok(keywords.length >= 6);
  assert.ok(keywords.includes("react"));
  assert.ok(keywords.includes("node.js"));
  assert.ok(keywords.includes("mongodb"));
});

test("buildResumeQuestionPrompt creates a valid prompt for resume-driven interviews", () => {
  const prompt = buildResumeQuestionPrompt({
    keywords: ["react", "node.js", "mongodb"],
    experience: "5 years",
    role: "Full Stack Engineer",
    numberOfQuestions: 5,
  });

  assert.match(prompt, /react/i);
  assert.match(prompt, /full stack engineer/i);
  assert.match(prompt, /5 years/i);
  assert.match(prompt, /5 interview questions/i);
});
