import './App.css';

import React, {useState, useEffect} from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loading from './components/loading';
import StudentLogin from './components/student/student_login';
import Student from './components/student/student';
import InstructorLogin from './components/instructor/instructor_login';
import CreateQuestion from './components/instructor/create_question';
import Leaderboard from './components/instructor/leaderboard';
import Instructor from './components/instructor/instructor';

import UserContext from './context/user.context';
import WebSocketContext from './context/websocket.context';

export default function App() {

  const [userData, setUserData] = useState({
    user: undefined,
    instructorCode: undefined,
    instructor: undefined
  });
  const [ws, setWS] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let tempWS;
    const initialize = async () => {
        // Set user data first
        const user = localStorage.getItem("user");
        const instructorCode = localStorage.getItem("instructorCode");
        let instructor = localStorage.getItem("instructor");
        if (instructor === "false"){
          instructor = false;
        } else if (instructor === "true") {
          instructor = true;
        }
        setUserData({
          user,
          instructorCode,
          instructor
        });

        // Initialize WebSocket
        tempWS = new WebSocket(process.env.REACT_APP_WEBSOCKET);
        setWS(tempWS);
        setReady(true);
    }

    initialize();

    return () => {
      tempWS.close();
    };
  }, []);

  return (
    <>
    {ready ? (
      <BrowserRouter>
         <UserContext.Provider value={{userData, setUserData}}>
          <WebSocketContext.Provider value={{ws, setWS}}>
            <ToastContainer
              position="top-right"
              //toastClassName={({ type }) => "Toastify__toast Toastify__toast-theme--colored " + contextClass[type || "default"]}
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Routes>
              <Route exact path="/student/login" Component={StudentLogin} />
              <Route exact path="/instructor/login" Component={InstructorLogin} />

              <Route exact path="/instructor/create" Component={CreateQuestion} />
              <Route exact path="/instructor/leaderboard" Component={Leaderboard} />
              <Route exact path="/instructor" Component={Instructor} />

              <Route exact path="/student" Component={Student} />
            </Routes>
          </WebSocketContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    ) : (
      <Loading />
    )
    }
    </>
  );
}
