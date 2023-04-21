import React, {useEffect, useState} from "react";
import "./rideOverViewPage.css";
import {useParams} from "react-router-dom";
import {Link, Route, Switch} from "react-router-dom";
import axios from "axios";
import RidePage from "../RidePage/RidePage";

function RideOverviewTest({location}) {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [rideItemClicked, setRideItemClicked] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pickUpLocation = searchParams.get('pickUpLocation');
        const destination = searchParams.get('destination');
        // const pax = searchParams.get('pax');
        const departureDate = searchParams.get('departureDate');


        async function fetchRides() {
            console.log(departureDate)
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/rides', {
                    params: {
                        pickUpLocation,
                        destination,
                        // pax,
                        departureDate,
                    },
                });
                console.log('Response:', response);

                const matchingRides = response.data.filter(ride => ride.departureDateTime.split("T")[0] === departureDate);
                if (matchingRides.length > 0) {
                    setRides(matchingRides);
                } else {
                    console.log("Geen rit")
                }
                // setRides(response.data);
            } catch (e) {
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
        return <p>Error fetching rides.</p>;
    }

    function handleRideItemClick() {
        setRideItemClicked(true);
    }

    // return (
    //     <rides className="outer-content-container">
    //         <div className="inner-content-container">
    //             <div className="rides-overview-page">
    //                 {rides.length === 0 && (
    //                     <p>
    //                         Er zijn op deze dag helaas nog geen ritten geplaatst naar jou
    //                         bestemming. Probeer het op een later tijdstip opnieuw.
    //                     </p>
    //                 )}
    //
    //
    //
    //                  {rides.length > 0 && (
    //                   <div>
    //                     {!rideItemClicked && <h2>Kies een rit</h2>}
    //                     <div className="rides-container">
    //
    //                         {rides.map((ride) => {
    //                             return (
    //                                 <React.Fragment key={ride.id}>
    //                                     {rideItemClicked ? (
    //                                         <Switch>
    //                                             <Route path="/rides/:id">
    //                                                 <RidePage/>
    //                                             </Route>
    //                                         </Switch>
    //                                     ) : (
    //
    //                                         <Link
    //                                             to={`/rides/${ride.id}`}
    //                                             key={ride.id}
    //                                             className="ride-item"
    //                                             onClick={() => setRideItemClicked(true)}
    //                                         >
    //                                             <h2>{ride.pickUpLocation} - {ride.destination}</h2>
    //                                             <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
    //                                             <p>Vertrek
    //                                                 tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
    //                                                     hour: '2-digit',
    //                                                     minute: '2-digit',
    //                                                     hour12: false
    //                                                 })}</p>
    //                                             <p>Aankomst tijd: {ride.eta}</p>
    //                                             <p>Prijs per persoon: {ride.pricePerPerson} euro</p>
    //                                             <p>Totaal prijs: {ride.totalRitPrice} euro</p>
    //                                             <p>Aantal personen: {ride.pax}</p>
    //                                         </Link>
    //
    //                                     )}
    //                                 </React.Fragment>
    //                             );
    //                         })}
    //                     </div>
    //                   </div>
    //                 )}
    //             </div>
    //         </div>
    //     </rides>
    // );

    return (
        <rides className="outer-content-container">
            <div className="inner-content-container">
                <div className="rides-overview-page">
                    <Switch>
                        <Route path="/rides/:id">
                            <RidePage/>
                        </Route>
                    </Switch>

                    {rides.length === 0 && (
                        <p>
                            Er zijn op deze dag helaas nog geen ritten geplaatst naar jou
                            bestemming. Probeer het op een later tijdstip opnieuw.
                        </p>
                    )}

                    {rides.length > 0 && (
                        <div>
                            {!rideItemClicked && <h2>Kies een rit</h2>}
                            <div className="rides-container">
                                {rides.map((ride) => {
                                    return (
                                        <React.Fragment key={ride.id}>
                                            {!rideItemClicked && (
                                                <Link
                                                    to={`/rides/${ride.id}`}
                                                    key={ride.id}
                                                    className="ride-item"
                                                    onClick={() => setRideItemClicked(true)}
                                                >
                                                    <h2>{ride.pickUpLocation} - {ride.destination}</h2>
                                                    <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
                                                    <p>Vertrek
                                                        tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })}</p>
                                                    <p>Aankomst tijd: {ride.eta}</p>
                                                    <p>Prijs per persoon: {ride.pricePerPerson} euro</p>
                                                    <p>Totaal prijs: {ride.totalRitPrice} euro</p>
                                                    <p>Aantal personen: {ride.pax}</p>
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

export default RideOverviewTest;