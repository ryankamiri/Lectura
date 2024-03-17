import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import WebSocketContext from '../../context/websocket.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';
import InstructorNavbar from './instructor_navbar';

export default function Instructor() {
    const [questions, setQuestions] = useState();
    const [currentQuestionData, setCurrentQuestionData] = useState({
        questionIndex: 0,
        answerCount: [],
      });
    const [askedQuestions, setAskedQuestions] = useState();
    const [askedQuestionsData, setAskedQuestionsData] = useState([]);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

    const [ready, setReady] = useState(false);

    const {userData} = useContext(UserContext);
    const {ws} = useContext(WebSocketContext);
    const navigate = useNavigate();

    ws.onmessage = async(event) => {
        const message = JSON.parse(event.data);
        switch(message.messageType){
          case("new_instructor_question"):
            const list = [...askedQuestions];
            list.push(message.content);
            setAskedQuestions(list);
            const points = [...askedQuestionsData];
            points.push(0);
            setAskedQuestionsData(points);
            break;
          case("answered_student_question"):
            const answerIndex = message.content.answerIndex;
            if (answerIndex >= 0 && questions[currentQuestionData.questionIndex].answers.length > answerIndex){
                // Valid Index
                const answerCount = [...currentQuestionData.answerCount];
                answerCount[answerIndex] += 1;
                setCurrentQuestionData({
                    questionIndex: currentQuestionData.questionIndex,
                    answerCount,
                });
            }
            break;
          default:
            console.log(message);
            break;
        }
    };

    const createZeroList = async(options) => {
        const list = []
        for(let i = 0; i<options; i++){
            list.push(0);
        }
        return list;
    };

    const clearAskedQuestion = async(index) => {
        try{
            const questionData = {
                question: askedQuestions[index].question,
                instructorCode: userData.instructorCode,
                reward: askedQuestionsData[index]
            };
            await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/reward', questionData);

            const askedList = [...askedQuestions];
            askedList.splice(index, 1);
            setAskedQuestions(askedList);

            const pointsList = [...askedQuestionsData];
            pointsList.splice(index, 1);
            setAskedQuestionsData(pointsList);

            toast.success("Cleared question!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        catch (err) {
            if(err.response.data.msg){
                toast.error(err.response.data.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    const handlePointInput = async(points, index) => {
        const list = [...askedQuestionsData];
        list[index] = parseInt(points);
        setAskedQuestionsData(list);
    };

    const changeQuestion = async(index) => {
        try{
            if (index >= 0 && index < questions.length){
                const answerCount = await createZeroList(questions[index].answers.length);
                setCurrentQuestionData({
                    questionIndex: index,
                    answerCount,
                });

                const questionData = {
                    question: questions[index].question,
                    instructorCode: userData.instructorCode,
                };
                await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/display', questionData);
            }
        }
        catch (err) {
            if(err.response.data.msg){
                toast.error(err.response.data.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }

    useEffect(() => {
        if(!userData.user) {
            return navigate('/instructor/login');
        }
    }, [navigate, userData]);
    
    useEffect(() => {
        const getData = async() => {
          try{
            const questionsRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question', { instructorCode: userData.instructorCode});
            setQuestions(questionsRes.data.questions);

            if(questionsRes.data.questions.length > 0){
                const q = questionsRes.data.questions[0];
                const answerCount = await createZeroList(q.answers.length);
                setCurrentQuestionData({
                    questionIndex: 0,
                    answerCount,
                });

                const questionData = {
                    question: q.question,
                    instructorCode: userData.instructorCode,
                };
                await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/display', questionData);
            }

            const askedQuestionsRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/asked', { instructorCode: userData.instructorCode});
            setAskedQuestions(askedQuestionsRes.data.askedQuestions);
            
            if(askedQuestionsRes.data.askedQuestions.length > 0){
                const points = await createZeroList(askedQuestionsRes.data.askedQuestions.length );
                setAskedQuestionsData(points);
            }

            setReady(true);
          }
          catch(err){
            toast.error(err.response.data.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        };
  
        getData();
  
      }, [userData]);

    return (
        <>
            <InstructorNavbar />
            {ready ? (
                <div className="row">
                    <div className="container">
                        <h1>Asked Questions</h1>
                        {askedQuestions.map((askedQuestion, i) => {
                            return (
                                <div key={"Asked Question " + i}>
                                    <h3 id={"Asked Question " + i}>{askedQuestion.question}</h3>
                                    <input id={"Points " + i} type="number" value={askedQuestionsData[i] || 0} onChange={e => handlePointInput(e.target.value, i)}/>
                                    <label htmlFor={"Points " + i}>Points</label>  
                                    <button onClick={() => clearAskedQuestion(i)}>Clear</button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="container">
                        <h1>Current Question Displayed</h1>
                        <button onClick={() => changeQuestion(currentQuestionData.questionIndex - 1)}>Back</button>
                        <button onClick={() => changeQuestion(currentQuestionData.questionIndex + 1)}>Next</button>
                        <h3>{questions[currentQuestionData.questionIndex].question}</h3>
                        {questions[currentQuestionData.questionIndex].answers.map((answer, i) => {
                                return (
                                    <div key={"Answer Choice " + i}>
                                        <h3 id={"Answer Choice " + i} style={{color: (showCorrectAnswer && i === questions[currentQuestionData.questionIndex].correctIndex ? "green" : "black")}}>{answer}</h3>
                                        <h4>Answers: {currentQuestionData.answerCount[i]}</h4>
                                    </div>
                                );
                        })}
                        <button onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}>{showCorrectAnswer ? "Hide Correct Answer" : "Show Correct Answer"}</button>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}