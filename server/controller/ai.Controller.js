const {GoogleGenAI} = require('@google/genai')
const {conceptExplainPrompt, questionAnswerPrompt} = require('../utils/prompts')

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// @description   Genrate Interview question and answers using Gemini
// @route          POST  /api/ai/generate-question
// @access         Private

const generateInterviewQuestion = async (req, res) =>{
    try {
        const {role, experience, topicsToFocus,numberOfQuestions } = req.body

        if(!role || !experience || !topicsToFocus || !numberOfQuestions){
           return res.status(400).json({message:"Misssing required filds"})
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus,numberOfQuestions)
        const response = await ai.models.generateContent({model:"gemini-2.0-flash", contents:prompt})
        
        let rawText = response.text

        // clean it: ```json and ``` from beginnign and end
        const cleanText = rawText
        .replace(/^```json\s*/, "")  // Remove starting ```json
        .replace(/```$/,"")          // remove ending ```
        .trim();                     // remove extra space

        // Now safe to parse
        const data = JSON.parse(cleanText)

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({message: "Failed to genrate the questions", error:error.message})
    }
}


// @description   Generate the explaination of a interview question
// @route          POST  /api/ai/generate-question
// @access         Private

const generateConceptExplanation = async (req, res) =>{
    try {
         const {question} = req.body

        if(!question){
           return res.status(400).json({message:"Misssing required filds"})
        }

        const prompt = conceptExplainPrompt(question)
        const response = await ai.models.generateContent({model:"gemini-2.0-flash", contents:prompt})
        
        let rawText = response.text

        // clean it: ```json and ``` from beginnign and end
        const cleanText = rawText
        .replace(/^```json\s*/, "")  // Remove starting ```json
        .replace(/```$/,"")          // remove ending ```
        .trim();                     // remove extra space

         
        // Now safe to parse
        const data = JSON.parse(cleanText)

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: "Failed to genrate the questions", error:error.message})
    }
}

module.exports = {generateConceptExplanation, generateInterviewQuestion}