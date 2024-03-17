import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import { toast } from 'react-toastify';
import '../../static/css/login.css';
import Logo2 from '../../static/images/logo2.png';

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
        <div className="container">
            <div className="row align-items-start">
                <div className="col-3"></div>
                <div className="col-6">
                <div className="mt-5 mb-3 text-center">
                    <img
                    src={Logo2}
                    alt="logo"
                    height="75"
                    id="logo"
                    />
                </div>
                <div className="text-center text-light pb-3">
                    Revolutionizing the classroom experience
                </div>
                <div className="justify-content-center text-center" id="login-card">
                    <div className="card bg-black" style={{borderRadius: "15px"}}>
                    <div className="card-body m-3">
                        <h5 className="card-title text-center p-3 text-light fw-bold fs-3">
                        Login to Lecture
                        </h5>
                        <div className="mb-3">
                            <input
                            type="email"
                            className="form-control p-2"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            onChange={e => setUser(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                            type="text"
                            className="form-control p-2"
                            id="class_code"
                            name="class_code"
                            placeholder="Enter class code"
                            required
                            onChange={e => setInstructorCode(e.target.value)}
                            />
                        </div>
                        <div className="text-center">
                            <button onClick={login}
                            className="btn btn-primary mt-2 mb-2 w-100"
                            >
                            Login
                            </button>
                        </div>
                        <div className="mt-2">
                            <button className="btn btn-transparent text-light" onClick={() => navigate("/student/login")}> Student? </button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    </>
    )
}