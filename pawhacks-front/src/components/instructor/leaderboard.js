import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';

export default function Leaderboard() {
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
                <div
                    className="container-fluid bg-black mt-5 pt-2"
                    style={{height: "95vh", overflowY: "auto"}}
                >
                <table className="table table-bordered container mt-2 table-dark">
                  <thead>
                    <tr>
                      <th className="colname" scope="col">#</th>
                      <th className="colname" scope="col">Username</th>
                      <th className="colname" scope="col">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((leaderboardData, i) => {
                        return (
                            <tr key={"Leaderboard " + i}>
                                <td>{i+1}</td>
                                <td>{leaderboardData.user}</td>
                                <td>{leaderboardData.points}</td>
                            </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
                <Loading />
            )}
        </>
    )
}