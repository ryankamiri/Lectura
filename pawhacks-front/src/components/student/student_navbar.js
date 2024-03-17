import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../../context/user.context';
import Logo2 from '../../static/images/logo2.png';
import LogoutIcon from '../../static/images/logout.png';

export default function StudentNavbar() {

    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();

    const logout = async() => {
        localStorage.setItem('user', "");
        localStorage.setItem('instructorCode', "");
        localStorage.setItem('instructor', "");
        setUserData({
            user: undefined,
            instructorCode: undefined,
            instructor: false
        });
        toast.success("Successfully Logged Out!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate('/student/login');
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark bg-black fixed-top py-2"
            style={{height: "6vh"}}
        >
            <div className="container-fluid row ps-4">
                <div className="navbar-nav col-4 ps-1">
                    <Link to='/student' className="nav-link text-light">{userData.instructorCode}'s Lecture</Link>
                </div>
                <div className="navbar-brand col-4 text-center ps-3">
                    <label>
                        <img src={Logo2} alt="Logo" height="35" />
                    </label>
                </div>
                <div
                    className="navbar-nav col-4 d-flex justify-content-end align-items-center"
                >
                    <label className="nav-link text-light hover" onClick={logout}>
                        <img
                        src={LogoutIcon}
                        alt="Logo"
                        height="25"
                        />
                    </label>
                </div>
            </div>
        </nav>
    )
}
