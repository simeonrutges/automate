import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";

function RideDetails() {
    const {rideId} = useParams();
    const [ride, setRide] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRide() {
            try {
                const response = await axios.get(`http://localhost:8080/rides/${rideId}`);
                setRide(response.data);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };


        fetchRide();
    }, [rideId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        if (error.includes("500")) {
            return <p>Sorry, deze rit is niet meer beschikbaar</p>
        } else {
            return <p>Error fetching ride: {error}</p>;
        }
    }

    if (!ride) {
        return <p>Rit niet gevonden</p>;
    }

    return (
        <div>
            <h2>Rit Overzicht</h2>
            <p> Kan deze pagina weg ????</p>

            {/*<h2>{ride.pickUpLocation} - {ride.destination}</h2>*/}
            {/*<p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>*/}
            {/*<p>Vertrek*/}
            {/*    tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {*/}
            {/*        hour: '2-digit',*/}
            {/*        minute: '2-digit',*/}
            {/*        hour12: false*/}
            {/*    })}</p>*/}
            {/*<p>Aankomst tijd: {ride.eta}</p>*/}
            {/*<p>Prijs per persoon: {ride.pricePerPerson} euro</p>*/}
            {/*<p>Totaal prijs: {ride.totalRitPrice} euro</p>*/}
            {/*<p>Aantal personen: {ride.pax}</p>*/}

        </div>
    );
}

export default RideDetails;
