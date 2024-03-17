const router = require('express').Router();
const Question = require('../models/question.model');
const AskedQuestion = require('../models/askedQuestion.model');
const Points = require('../models/points.model');
const WebSocket = require('../websocket');

router.post('/question', async (req, res) => {
    try{
        const {instructorCode} = req.body;
        
        const questions = await Question.find({instructorCode});

        return res.json({
            status: true,
            questions
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question/asked', async (req, res) => {
    try{
        const {instructorCode} = req.body;
        
        const askedQuestions = await AskedQuestion.find({instructorCode, active: true});

        return res.json({
            status: true,
            askedQuestions
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/points', async (req, res) => {
    try{
        const {instructorCode} = req.body;
        
        const points = await Points.find({instructorCode}).sort({points: -1});
        
        return res.json({
            status: true,
            points
        })
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question/create', async (req, res) => {
    try{
        const {question, answers, correctIndex, instructorCode} = req.body;
        
        const newQuestion = new Question({
            question,
            answers,
            correctIndex,
            instructorCode,
            active: false
        });

        await newQuestion.save();

        return res.json({
            status: true
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});

router.post('/question/display', async (req, res) => {
    try{
        const {question, instructorCode} = req.body;
        const activeQuestions = await Question.find({active: true, instructorCode});
        for(let i = 0; i < activeQuestions.length; i++){
            const activeQuestion = activeQuestions[i];
            activeQuestion.active = false;
            await activeQuestion.save();
        }
        const displayQuestion = await Question.findOne({question, instructorCode});
        if(!displayQuestion) {
            return res.status(400).json({status: false, msg: "Coulnd't find question."})
        }
        displayQuestion.active = true;
        await displayQuestion.save();
        WebSocket.broadcast({
            messageType: "new_student_question",
            content: {question, answers: displayQuestion.answers, instructorCode}
        });
        return res.json({status: true});
    }
    catch (err) {
        return res.status(500).json({msg: err.message});
    }
});

router.post('/question/reward', async (req, res) => {
    try{
        // question, user, instructorCode
        const {question, instructorCode, reward} = req.body;
        
        const rewardQuestion = await AskedQuestion.findOne({question, instructorCode});
        if(!rewardQuestion) {
            return res.status(400).json({status: false, msg: "Coulnd't find question."})
        }
        if (reward > 0) {
            // points, user, instructorCode
            let points = await Points.findOne({user: rewardQuestion.user, instructorCode});
            if(!points) {
                points = new Points({
                    points: 0,
                    user: rewardQuestion.user,
                    instructorCode,
                });
            }
            points.points += reward
    
            await points.save();
        }

        // Delete question
        await rewardQuestion.remove().exec();

        WebSocket.broadcast({
            messageType: "clear_instructor_question",
            content: rewardQuestion
        });

        return res.json({
            status: true
        });
    }
    catch(err){
        return res.status(500).json({status: false, msg: err.message});
    }
});



module.exports = router;