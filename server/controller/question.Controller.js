const Questions = require("../model/Questions");
const Session = require("../model/Session");


// @description  Add additional question to exixting session
// @route        Post /api/question/add
// @access       Private
exports.addQuestionsToSession = async (req, res) =>{
    try {
        const {sessionId, questions} = req.body;
        if(!questions || !sessionId || !Array.isArray(questions)){
            return res.status(400).json({message: "Invalid Input"})
        }

        const session = await Session.findById(sessionId);
        if(!session){
            return res.status(404).json({message:"Session not found"})
        }

        // Create new Questions
        const createQuestions = await Questions.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer

            }))
        );


        // Update questions to include new questions IDs
        session.questions.push(...createQuestions.map((q) => q._id));
        await session.save();

        res.status(201).json(createQuestions)



        
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
} 


// @description  Pin or unPin question
// @route        Post /api/question/:id/pin
// @access       Private
exports.togglePinQuestion = async (req, res) =>{
    try {
        const question = await Questions.findById(req.params.id);

        if(!question){
            return res.status(404).json({success:false, message: "question not found" })
        }

        question.isPinned = ! question.isPinned;
        await question.save()

        res.status(200).json({success: true, question})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
} 


// @description  Update a note for a question
// @route        Post /api/question/:id/note
// @access       Private
exports.updateQuestionNote = async (req, res) =>{
    try {
        const {note} = req.body;
        const question = await Questions.findById(req.params.id);

        if(!question){
            return res.status(404).json({success: false, message:"Question Not found"})
        }
        question.note = note || "";
        res.status(200).json({success: true, question})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
} 