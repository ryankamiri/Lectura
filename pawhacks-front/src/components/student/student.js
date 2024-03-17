import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import WebSocketContext from '../../context/websocket.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default function Student() {
    const [question, setQuestion] = useState({
        question: "",
        answers: [""]
    });
    const [askedQuestions, setAskedQuestions] = useState();
    const [questionText, setQuestionText] = useState();
    const [answerIndex, setAnswerIndex] = useState(-1);

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
            break;
          case("new_student_question"):
            setQuestion({
                question: message.content.question,
                answers: message.content.answers
            })
            setAnswerIndex(-1);
            break;
          case("clear_instructor_question"):
            const list2 = [...askedQuestions];
            for(let i = 0; i < list2.length; i++) {
                let q = list2[i];
                if (q.question === message.content.question && q.user === message.content.user && q.instructorCode === message.content.instructorCode) {
                    list2.splice(i, 1);
                    break;
                }
            }
            setAskedQuestions(list2);
            break;
          default:
            console.log(message);
            break;
        }
    };

    const answerQuestion = async(index) => {
        try{
            if (index >= 0 && question.answers.length > index && answerIndex === -1){
                const answerData = { 
                    user: userData.user,
                    answerIndex: index,
                    instructorCode: userData.instructorCode
                };
                await Axios.post(process.env.REACT_APP_DOMAIN + '/api/student/question/answer', answerData);
                setAnswerIndex(index);
            }
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

    const handleKeyDown = async(event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await askQuestion();
        }
    };

    const askQuestion = async() => {
        try{
            const newQuestion = { 
                user: userData.user,
                question: questionText,
                instructorCode: userData.instructorCode
            };
            await Axios.post(process.env.REACT_APP_DOMAIN + '/api/student/question/ask', newQuestion);
            setQuestionText("");
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

    useEffect(() => {
        if(!userData.user) {
            return navigate('/student/login');
        }
    }, [navigate, userData]);
    
    useEffect(() => {
        const getData = async() => {
          try{
            const questionRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/student/question', { instructorCode: userData.instructorCode});
            setQuestion({
                question: questionRes.data.question,
                answers: questionRes.data.answers
            });

            const askedQuestionsRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/asked', { instructorCode: userData.instructorCode});
            setAskedQuestions(askedQuestionsRes.data.askedQuestions);

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
            {ready ? (
                <div className="row">
                    <div className="container">
                        <h1>Asked Questions</h1>
                        {askedQuestions.map((askedQuestion, i) => {
                            return (
                                <div key={"Asked Question " + i}>
                                    <h3 id={"Asked Question " + i} style={{color: (userData.user === askedQuestion.user ? "green" : "black")}}>{askedQuestion.question}</h3>
                                </div>
                            );
                        })}
                        <form>
                            <input id="askQuestion" type="text" value={questionText || ""} onKeyDown={handleKeyDown} onChange={e => setQuestionText(e.target.value)}/>
                        </form>
                    </div>
                    <div className="container">
                        <h1>Current Question</h1>
                        <h2>{question.question}</h2>
                        {question.answers.map((answer, i) => {
                                return (
                                    <div key={"Answer Choice " + i}>
                                        <h3 id={"Answer Choice " + i} style={{color: (answerIndex === i ? "blue" : "black")}}onClick={() => answerQuestion(i)}>{answer}</h3>
                                    </div>
                                );
                        })}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}