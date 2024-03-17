import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Axios from 'axios';
import { toast } from 'react-toastify';
import InstructorNavbar from './instructor_navbar';

export default function CreateQuestion() {
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState([]);
    const [answerText, setAnswerText] = useState();
    const [correctIndex, setCorrectIndex] = useState(-1);

    const {userData} = useContext(UserContext);
    const navigate = useNavigate();

    const create = async() => {
        try{
            if(answers.length === 0){
                return toast.error("Please have at least one answer.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (correctIndex === -1) {
                return toast.error("Please select a correct answer.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            const questionData = {
                question, 
                answers,
                correctIndex,
                instructorCode: userData.instructorCode
            };
            await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/create', questionData);
            setQuestion("");
            setAnswers([]);
            setCorrectIndex(-1);
            toast.success("Created question!", {
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

    // const editAnswer = async(value, index) => {
    //     const list = [...answers];
    //     list[index] = value;
    //     setAnswers(list);
    // };

    const removeAnswer = async() => {
        const list = [...answers];
        list.splice(list.length - 1, 1);
        setAnswers(list);
    };

    const addAnswer = async() => {
        const list = [...answers];
        list.push(answerText);
        setAnswerText("");
        setAnswers(list);
    };

    useEffect(() => {
        if(!userData.user) {
            return navigate('/instructor/login');
        } else if (userData.user && !userData.instructor) {
            return navigate('/student');
        }
    }, [navigate, userData]);

    return (
        <>
            <InstructorNavbar/>
            <div className="container-fluid bg-black mt-5 pt-3 d-flex justify-content-center" style={{height: "95vh"}}>
                <div className="card text-bg-dark text-center d-flex" style={{height: "92vh", width: "90vw"}}>
                    <h5 className="card-header py-3">Create Question</h5>
                    <div className="card-body" style={{overflowY: "auto"}}>
                        <div className="row">
                            <div className="col-1"></div>
                            <div className="col-10">
                                <h2 className="pb-3">Enter your question:</h2>
                                <div className="mb-4">
                                    <form>
                                        <textarea
                                        className="form-control form-control-lg text-bg-dark placeholder-light"
                                        rows="1"
                                        placeholder="Enter question here..."
                                        value={question || ''}
                                        onChange={e => setQuestion(e.target.value)}
                                        ></textarea>
                                    </form>
                                </div>

                                <h3 className="pb-3">Select correct answer:</h3>
                                {answers.map((answer, i) => {
                                    return (
                                        <>
                                        <input key={"Answer Text " + i} type="radio" onClick={() => setCorrectIndex(i)} className="btn btn-check btn-outline-light" name="options-base" id={"Answer Text " + i} autoComplete="off" />
                                        <label className="btn btn-outline-success w-100 text-start text-light my-2 py-4" for={"Answer Text " + i}>{answer}</label>
                                        </>
                                    );
                                })}

                                <input type="text" className="form-control my-2 py-4 form-control-lg text-bg-dark placeholder-light" placeholder="Enter new option" value={answerText|| ''} onChange={e => setAnswerText(e.target.value)} />
                                <div className="row d-flex justify-content-center">
                                    <button
                                        className="btn btn-outline-success w-20 my-2 py-4 mx-3 col-2"
                                        onClick={addAnswer}
                                        >Add Option</button>
                                    <button
                                        className="btn btn-outline-danger w-20 my-2 py-4 mx-3 col-2"
                                        onClick={removeAnswer}
                                        >Delete Last Option</button>
                                </div>
                                <button
                                    className="btn btn-outline-light w-20 my-2 py-4"
                                    onClick={create}
                                    >Create Question</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}