import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";

function MyRides() {
    const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);

    const [rides, setRides] = useState([]);
    // const username = 'yourUserId'; // Replace this with the actual user ID you want to use

    useEffect(() => {
    async function fetchRides() {
        try {
            const username = isAuth && user.username ? user.username : '';
            console.log("username: " + username);

            const response = await axios.get(`http://localhost:8080/users/${username}/rides`);

            setRides(response.data);
            console.log("data...:"  + response.data);
        } catch (error) {
            console.error(error);
        }
    }
        fetchRides();
    }, []);

    return (
        <div>
            <h1>Mijn ritten</h1>
            <div>
                {rides.map((ride) => (
                    <div key={ride.id} className="ride">
                        {/* Display relevant ride information */}
                        <h3>Destination: {ride.destination}</h3>
                        <p>Vertrek: {ride.pickUpLocation}</p>
                        {/*<p>Aankomst: {ride.arrival}</p>*/}
                        {/*<p>Datum: {ride.date}</p>*/}
                        {/*<p>Tijd: {ride.time}</p>*/}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyRides;


