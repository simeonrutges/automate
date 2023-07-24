import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

function Notification(props) {
    const token = localStorage.getItem('token');

    const [notification, setNotification] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNotification() {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${props.match.params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                setNotification(response.data);
            } catch (e) {
                setError(e.message);
            }
        };

        fetchNotification();
    }, [props.match.params.id]);

    if (error) {
        return <div>Fout: {error}</div>;
    }

    if (notification === null) {
        return <div>Laden...</div>;
    }

    const typeMapping = {
        "RIDE_CONFIRMATION": "De rit is bevestigd!",
        "RIDE_CANCELLED_BY_DRIVER": "De bestuurder heeft de rit geannuleerd",
        "PASSENGER_JOINED_RIDE": "Je hebt een nieuwe passagier!",
        "PASSENGER_LEFT_RIDE": "Een passagier heeft zijn reis geannuleerd ",
    };

    const displayType = typeMapping[notification.type] || notification.type;  // Gebruik het notificatietype als er geen mapping beschikbaar is.

    const date = new Date(notification.sentDate);
    const formattedDate = date.toLocaleDateString('nl-NL', {day: '2-digit', month: '2-digit', year: 'numeric'});
    const formattedTime = date.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'});
    const displayDate = `${formattedDate} om ${formattedTime}`;

    const rideDetails = notification.rideDetails.replace("Rit details: ", "").split(", ");

    const rideDetailsObj = rideDetails.reduce((obj, detail) => {
        const [key, value] = detail.split(" - ");
        obj[key] = value;
        return obj;
    }, {});

    const {
        "Driver": driver,
        "Pick Up Location": pickUpLocation,
        "Destination": destination,
        "Departure DateTime": departureDateTime,
        "Pax": pax,
        "Estimated Arrival Time": estimatedArrivalTime
    } = rideDetailsObj;

    // Haal rideId direct uit notification
    const {rideId} = notification;

    const departureDate = new Date(departureDateTime);
    const formattedDepartureDate = departureDate.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedDepartureTime = departureDate.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'});
    const displayDepartureDateTime = `${formattedDepartureDate} om ${formattedDepartureTime}`;

    return (
        <ride className="outer-content-container">
            <div className="inner-content-container">

                <div>
                    <h1>{displayType}</h1>
                    <p>Bericht datum: {displayDate}</p>
                    {notification.type === "RIDE_CANCELLED_BY_DRIVER" &&
                        <p>Bestuurder: <Link to={`/profile/${driver}`}>{driver}</Link></p>}
                    <p>Ophaal locatie: {pickUpLocation}</p>
                    <p>Bestemming: {destination}</p>
                    <p>Vertrek: {displayDepartureDateTime}</p>
                    <p>Aankomsttijd: {estimatedArrivalTime}</p>
                    {notification.type !== "RIDE_CANCELLED_BY_DRIVER" &&
                        <p>BELANGRIJK! Raadpleeg altijd de meest recente updates via <Link to={`/rides/${rideId}`}>"Mijn
                            ritten"</Link></p>}
                </div>

            </div>
        </ride>
    );
}

export default Notification;
