// Example: Using Groq /responses endpoint with OpenAI SDK
export const groqSampleResponse = async (req, res) => {
  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: "Tell me a three sentence bedtime story about a unicorn.",
    });
    res.status(200).json({ output: response.output_text });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get Groq sample response",
      error: error.message,
    });
  }
};
import OpenAI from "openai";
import prompts from "../utils/prompts.js";
const { conceptExplainPrompt, questionAnswerPrompt } = prompts;

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

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
    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview question generator. Respond in JSON format only.",
        },
        { role: "user", content: prompt },
      ],
    });

    let rawText = response.choices[0].message.content;

    // clean it: ```json and ``` from beginning and end
    const cleanText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra space

    // Now safe to parse
    const data = JSON.parse(cleanText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate the questions",
      error: error.message,
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
    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview concept explainer. Respond in JSON format only.",
        },
        { role: "user", content: prompt },
      ],
    });

    let rawText = response.choices[0].message.content;

    // clean it: ```json and ``` from beginning and end
    const cleanText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); // remove extra space

    // Now safe to parse
    const data = JSON.parse(cleanText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to genrate the questions",
      error: error.message,
    });
  }
};

export { generateConceptExplanation, generateInterviewQuestion };
