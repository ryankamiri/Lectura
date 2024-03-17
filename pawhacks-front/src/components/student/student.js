import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import WebSocketContext from '../../context/websocket.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';
import StudentNavbar from './student_navbar';

export default function Student() {
    const [question, setQuestion] = useState({
        question: "NA",
        answers: ["NA"]
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
            <StudentNavbar />
            {ready ? (
                <div className="container-fluid bg-black mt-5 pt-2">
                    <div className="row">
                        <div className="col-6 p-1 h-100">
                            <div className="card text-bg-dark" style={{height: "93vh"}}>
                                <h5 className="text-center card-header py-3">Questions</h5>
                                <div className="card-body" style={{height: "60vh", overflowY: "auto"}}>
                                    {askedQuestions.map((askedQuestion, i) => {
                                        return (
                                            <div className={userData.user === askedQuestion.user ? "d-flex flex-row justify-content-end mb-4" : "d-flex flex-row justify-content-start mb-4"}>
                                                <div
                                                    className={userData.user === askedQuestion.user ? "p-3 me-3" : "p-3 ms-3 text-bg-light"}
                                                    style={{
                                                    borderRadius: "15px",
                                                    backgroundColor: "rgba(57, 192, 237, 0.2)"
                                                    }}
                                                >
                                                    <p className="small mb-0">
                                                    {askedQuestion.question}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mb-3 align-text-bottom card-footer">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Enter your question"
                                        value={questionText || ""}
                                        onKeyDown={handleKeyDown}
                                        onChange={e => setQuestionText(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 p-1 h-100">
                            <div className="card text-bg-dark" style={{height: "93vh", overflowY: "auto"}}>
                                <h5 className="text-center card-header py-3">Poll</h5>
                                <div className="card-body">
                                    <h2 className="card-text py-2">{question.question}</h2>
                                    {question.answers.map((answer, i) => {
                                            return (
                                                <p
                                                key={"Answer Choice " + i}
                                                className={(answerIndex === -1) ? "btn btn-outline-light w-100 text-start my-2 py-4" : (answerIndex === i) ? "btn btn-outline-light w-100 text-start my-2 py-4 active" : "btn btn-outline-light w-100 text-start my-2 py-4 disabled"}
                                                role="button"
                                                data-bs-toggle="button"
                                                aria-pressed="false"
                                                onClick={() => answerQuestion(i)}
                                                >{answer}</p>
                                            );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
            ) : (
                <Loading />
            )}
        </>
    )
}