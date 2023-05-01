import React, { useState, useEffect } from 'react';
import axios from "axios";

function MyRides() {
    const [rides, setRides] = useState([]);
    // const id = 'yourUserId'; // Replace this with the actual user ID you want to use

    useEffect(() => {
    async function fetchRides() {
        try {
            const response = await axios.get('https://localhost:8080/rides/');
            setRides(response.data);
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
                        <h3>Rit: {ride.name}</h3>
                        <p>Vertrek: {ride.departure}</p>
                        <p>Aankomst: {ride.arrival}</p>
                        <p>Datum: {ride.date}</p>
                        <p>Tijd: {ride.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyRides;


