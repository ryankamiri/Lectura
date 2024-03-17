import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Axios from 'axios';
import { toast } from 'react-toastify';
import InstructorNavbar from './instructor_navbar';

export default function CreateQuestion() {
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState([""]);
    const [correctIndex, setCorrectIndex] = useState(0);

    const {userData} = useContext(UserContext);
    const navigate = useNavigate();

    const create = async() => {
        try{
            const questionData = {
                question, 
                answers,
                correctIndex,
                instructorCode: userData.instructorCode
            };
            await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/question/create', questionData);
            setQuestion("");
            setAnswers([""]);
            setCorrectIndex(0);
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

    const editAnswer = async(value, index) => {
        const list = [...answers];
        list[index] = value;
        setAnswers(list);
    };

    const removeAnswer = async() => {
        const list = [...answers];
        list.splice(list.length - 1, 1);
        setAnswers(list);
    };

    const addAnswer = async() => {
        const list = [...answers];
        list.push("");
        setAnswers(list);
    };

    useEffect(() => {
        if(!userData.user) {
            return navigate('/instructor/login');
        }
    }, [navigate, userData]);

    return (
        <>
            <InstructorNavbar/>
            <div className="container">
                <input id="question" type="text" value={question || ''} onChange={e => setQuestion(e.target.value)}/>
                <label htmlFor="question">Question</label>
                {answers.map((answer, i) => {
                    return (
                        <div key={"Answer Text " + i}>
                            <input id={"Answer Text " + i} type="text" value={answer|| ''} onChange={e => editAnswer(e.target.value, i)}/>
                            <label htmlFor={"Answer Text " + i} onClick={() => setCorrectIndex(i)} style={{color: (i ===  correctIndex ? "green" : "black")}} >Answer</label>
                        </div>
                    );
                })}
                <button onClick={addAnswer}>Add Answer</button>
                <button onClick={removeAnswer}>Remove Answer</button>
                <button onClick={create}>Create Question</button>
            </div>
        </>
    )
}