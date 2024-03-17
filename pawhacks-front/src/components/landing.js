import React from 'react';
import Logo from '../static/images/logo.png'
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="container">
            <div className="row align-items-start">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className="mt-5 mb-3 text-center">
                        <img
                            src={Logo}
                            alt="logo"
                            height="100"
                            id="logo"
                        />
                        <div style={{height: "15vh"}}></div>
                        <div className="align-items-center">
                            <div className="m-3 justify-content-center">
                                <h5 className="card-title p-3 text-light fw-bold fs-3" style={{fontFamily: "Anonymous Pro"}}>
                                    Welcome to Lectura
                                </h5>
                                <h4 className="text-center text-light mb-3 ps-4 typing-anim">
                                    Revolutionizing the classroom experience.
                                </h4>
                                <Link to="/student/login" className="btn btn-primary w-25 mt-3">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}