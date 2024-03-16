import './App.css';

import React, {useState, useEffect} from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loading from './components/loading';
import StudentLogin from './components/student/student_login';

import UserContext from './context/user.context';
import WebSocketContext from './context/websocket.context';

export default function App() {

  const [userData, setUserData] = useState({
    user: undefined,
    instructorCode: undefined,
  });
  const [ws, setWS] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let tempWS;
    const initialize = async () => {
        // Set user data first
        const user = localStorage.getItem("user");
        const instructorCode = localStorage.getItem("instructorCode");
        setUserData({
          user,
          instructorCode,
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
