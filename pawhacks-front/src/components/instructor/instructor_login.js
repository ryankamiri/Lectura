import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import { toast } from 'react-toastify';

export default function InstructorLogin() {
    const [user, setUser] = useState();
    const [instructorCode, setInstructorCode] = useState();

    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();

    const login = async() => {
        localStorage.setItem('user', user);
        localStorage.setItem('instructorCode', instructorCode);
        localStorage.setItem('instructor', true);
        setUserData({
            user,
            instructorCode,
            instructor: true
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
        navigate('/instructor');
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
        <input id="user" type="text"onChange={e => setUser(e.target.value)}/>
        <label htmlFor="user">Email</label>
        <input id="instructorCode" type="text" onChange={e => setInstructorCode(e.target.value)}/>
        <label htmlFor="instructorCode">Instructor Code</label>
        <button onClick={login}>Log in</button>
    </>
    )
}