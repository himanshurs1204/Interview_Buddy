const express = require('express')
const{togglePinQuestion, updateQuestionNote, addQuestionsToSession} = require('../controller/question.Controller')
const { protect } = require('../middlewares/auth.Middleware')

const router = express.Router();

router.post('/add', protect, addQuestionsToSession);
router.post('/:id/pin', protect, togglePinQuestion);
router.post('/:id/note', protect, updateQuestionNote);

module.exports = router;