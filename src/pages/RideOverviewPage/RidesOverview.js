import React, {useEffect, useState} from "react";
import  './rideOverViewPage.css';
import {useParams} from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";

function RidesOverview({ location }) {
    const token = localStorage.getItem('token');

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [rideItemClicked, setRideItemClicked] = useState(false);

    const params = useParams();
    const [pax, setPax] = useState(null);  // nieuwe state variabele
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        const paxParam = searchParams.get('pax'); // gebruik nieuwe variabele hier
        setPax(paxParam);  // bewaar de waarde van pax in de state
    }, [location.search]);

    useEffect(() => {
        const pickUpLocation = searchParams.get('pickUpLocation');
        const destination = searchParams.get('destination');
        const pax = searchParams.get('pax');
        const departureDate = searchParams.get('departureDate');

        async function fetchRides() {
            console.log("location: ", location);
            console.log(departureDate, pickUpLocation, destination, pax);

            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/rides', {
                    params: {
                        pickUpLocation,
                        destination,
                        pax,
                        departureDate,
                    },
                    headers: {
                        "Content-Type": 'application/json',
                    }
                });
                console.log('Response:', response);

                const matchingRides = response.data.filter(ride => ride.departureDateTime.split("T")[0] === departureDate);
                console.log("matchingRide: ", matchingRides);
                if (matchingRides.length > 0) {
                    setRides(matchingRides);
                } else {
                    console.log("Geen rit")
                }
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchRides();
    }, [location.search]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching rides. RideOverview</p>;
    }

    function handleRideItemClick() {
        setRideItemClicked(true);
    }

    return (
        <rides className="outer-content-container">
            <div className="inner-content-container">
                <div className="rides-overview-page">
                    {rides.length === 0 && (
                        <p>
                            Er zijn op deze dag helaas nog geen ritten geplaatst naar jouw
                            bestemming. Probeer het op een later tijdstip opnieuw.
                        </p>
                    )}
                    {rides.length > 0 && (
                        <div>
                            {!rideItemClicked && <h2>Kies een rit (RidesOverview)</h2>}
                            <div className="rides-container">
                                {rides.map((ride) => {
                                    return (
                                        <React.Fragment key={ride.id}>
                                            {!rideItemClicked && (
                                                <Link
                                                    to={`/rides/${ride.id}?pax=${pax}`}
                                                    key={ride.id}
                                                    className="ride-item"
                                                    onClick={handleRideItemClick}
                                                >
                                                    <div className="pickup-destination-container">
                                                        <div className="address-container">
                                                            <h2 className="city">{ride.pickUpLocation}</h2>
                                                            <p>{ride.pickUpAddress} </p>
                                                        </div>
                                                        <h2 id="divider">-</h2>
                                                        <div className="address-container">
                                                            <h2 className="city">{ride.destination}</h2>
                                                            <p>{ride.destinationAddress}</p>
                                                        </div>
                                                    </div>

                                                    <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
                                                    <p>Vertrektijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })}</p>
                                                    <p>Aankomsttijd: {ride.eta.substring(0, 5)}</p>
                                                    <p>
                                                        Prijs per
                                                        persoon: {ride.pricePerPerson.toLocaleString('nl-NL', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    })}
                                                    </p>
                                                    <p>Beschikbare stoelen: {ride.availableSpots}</p>

                                                </Link>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </rides>
    );
}

export default RidesOverview;

