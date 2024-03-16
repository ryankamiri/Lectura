import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default function StudentLogin() {
    const [user, setUser] = useState();
    const [instructorCode, setInstructorCode] = useState();

    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();

    const login = async() => {
        try{
            const loginUser = {
                user, 
                instructorCode
            };
            await Axios.post(process.env.REACT_APP_DOMAIN + '/api/student/points', loginUser);
            localStorage.setItem('user', user);
            localStorage.setItem('instructorCode', instructorCode);
            localStorage.setItem('instructor', false);
            setUserData({
                user,
                instructorCode,
                instructor: false
            });
            toast.success("Successfully Logged In!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/student');
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

    useEffect(() => {
        if(userData.user && userData.instructor) {
            return navigate('/instructor');
        } else if (userData.user && !userData.instructor) {
            return navigate('/student');
        }
    }, [navigate, userData]);

    return (
    <>
        <div className="container">
            <input id="user" type="text" onChange={e => setUser(e.target.value)}/>
            <label htmlFor="user">Email</label>
            <input id="instructorCode" type="text" onChange={e => setInstructorCode(e.target.value)}/>
            <label htmlFor="instructorCode">Instructor Code</label>
            <button onClick={login}>Join class</button>
        </div>
    </>
    )
}