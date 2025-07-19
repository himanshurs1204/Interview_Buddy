const Session = require('../model/Session')
const Questions = require('../model/Questions')


// @decription  Create new session and linked questions
// @route POST /api/session/create
// @access Private

exports.createSession = async (req, res) =>{
    try {
        const {role, experience, topicsToFocus, description, questions } = req.body
        const userId = req.user._id;   // Assuming u have a middleware setting req.user

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        })

        const questionDocs = await Promise.all(
            questions.map(async (q) =>{
                const question = await Questions.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return question._id;
            })
        )

        session.questions = questionDocs
        await session.save();
        res.status(200).json({success: true, session})
    } catch (error) {
        res.status(500).json({success: false, message:"Server Error",error: error.message})
    }
}

// @decription  Get All session for all loged in users 
// @route POST /api/sessions/my-session
// @access Private

exports.getMysession = async (req, res) =>{
    try {
        const session = await Session.find({user: req.user.id})
        .sort({createdAt: -1})
        .populate("questions");
        res.status(200).json(session)
    }
     catch (error) {
        res.status(500).json({success: false, message:"Server Error"})
    }
}

// @decription  Get a session by ID with poopulated questions
// @route get /api/session/:id
// @access Private

exports.getSessionById = async (req, res) =>{
    try {
        const session = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options: {sort:{isPinned: -1, createdAt: 1}},
        })
        .exec();
        if(!session){
            return res.status(400).json({success: false, message: "Session not found"})
        }

        res.status(200).json({success: true, session})

    } catch (error) {
        res.status(500).json({success: false, message:"Server Error"})
    }
}

// @decription  Delete a session and its questions
// @route POST /api/session/delete
// @access Private

exports.deleteSession = async (req, res) =>{
    try {
        const session = await Session.findById(req.params.id)
        if(!session){
            return res.status(404).json({message:"Session not found"})
        }
        // Check if logged in user owns this session
        if(session.user.toString() !== req.user.id){
            return res.status(401).json({message:"Not authorized to delete user"})
        }

        // first delete all questions linked to this session
        await Questions.deleteMany({session:session._id})

        // Then delete the session
        await session.deleteOne();

        res.status(200).json({message:"session deleted successfully"})

    } catch (error) {
        res.status(500).json({success: false, message:"Server Error", error: error.message})
    }
}