import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default function Instructor() {
    const [leaderboard, setLeaderboard] = useState();

    const [ready, setReady] = useState(false);

    const {userData} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userData.user) {
            return navigate('/instructor/login');
        }
    }, [navigate, userData]);
    
    useEffect(() => {
        const getData = async() => {
          try{
            const pointsRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/points', { instructorCode: userData.instructorCode});
            setLeaderboard(pointsRes.data.points);

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
            {ready ? (
                <div className="container">
                    <h1>Leaderboard</h1>
                    {leaderboard.map((leaderboardData, i) => {
                        return (
                            <div key={"Leaderboard " + i}>
                                <h3 id={"Leaderboard " + i}>{leaderboardData.user} | {leaderboardData.points}</h3>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}