const router = require('express').Router();
const Question = require('../models/question.model');
const AskedQuestion = require('../models/askedQuestion.model');
const Points = require('../models/points.model');
const WebSocket = require('../websocket');

router.post('/points', async (req, res) => {
    try{
        const {user, instructorCode} = req.body;
        // points, user, instructorCode
        const points = await Points.findOne({user, instructorCode});
        
        if(!points) {
            const newPoints = new Points({
                points: 0,
                user,
                instructorCode,
            });
    
            await newPoints.save();
            return res.json({
                status: true,
                points: 0
            })
        }

        return res.json({
            status: true,
            points: points.points
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question', async (req, res) => {
    try{
        const {instructorCode} = req.body;
        // question, answers, correctIndex, instructorCode, active
        const question = await Question.findOne({instructorCode, active: true});
        
        return res.json({
            status: true,
            question: question.question,
            answers: question.answers,
            instructorCode: instructorCode
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question/ask', async (req, res) => {
    try{
        const {question, user, instructorCode} = req.body;
        // question, user, instructorCode, active
        const newAskedQuestion = new AskedQuestion({
            question,
            user,
            instructorCode,
            active: true
        });

        await newAskedQuestion.save();

        WebSocket.broadcast({
            messageType: "new_instructor_question",
            content: newAskedQuestion
        });

        return res.json({
            status: true
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question/answer', async (req, res) => {
    try{
        const {user, answerIndex, instructorCode} = req.body;
        // question, answers, correctIndex, instructorCode, active
        const displayQuestion = await Question.findOne({instructorCode, active: true});
        if(!displayQuestion) {
            return res.status(400).json({status: false, msg: "Coulnd't find question."})
        }
        
        
        if(answerIndex == displayQuestion.correctIndex) {
            // Reward with points.

            // points, user, instructorCode
            const points = await Points.findOne({user, instructorCode});
            points.points += 50
    
            await points.save();
        }
        // wrong: do nothing

        WebSocket.broadcast({
            messageType: "answered_student_question",
            content: {answered: true}
        });

        return res.json({status: true});
    }
    catch (err) {
        return res.status(500).json({msg: err.message});
    }
});



module.exports = router;