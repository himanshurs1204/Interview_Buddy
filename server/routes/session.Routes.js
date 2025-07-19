const express = require('express')
const {createSession, getSessionById, getMysession, deleteSession} = require('../controller/session.Controller')
const {protect} = require('../middlewares/auth.Middleware');
const { route } = require('./auth.Routes');

const router = express.Router();

router.post('/create', protect, createSession);
router.get('/my-session', protect, getMysession)
router.get('/:id',protect,getSessionById)
router.delete('/delete/:id', protect, deleteSession)

module.exports = router;
