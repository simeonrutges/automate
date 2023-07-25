import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {Link, Route, Switch} from "react-router-dom";
import RidePageTest from "../RidePage/RidePage";

const RidesComponent = ({rides, user, rideItemClicked, setRideItemClicked}) => (
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
                            <p>Aankomst tijd: {ride.eta.substring(0, 5)}</p>

                            {user.username === ride.driverUsername && (
                                <p>Aantal vrije stoelen: {ride.availableSpots}</p>)}

                            {user.username === ride.driverUsername && (
                                <p>Gereserveerde stoelen: {ride.pax}</p>
                            )}

                            <p>Prijs per
                                persoon: {ride.pricePerPerson && ride.pricePerPerson.toLocaleString('nl-NL', {
                                    style: 'currency',
                                    currency: 'EUR'
                                })}</p>

                            {user.username === ride.driverUsername && (
                                <p>Totaal
                                    prijs: {ride.totalRitPrice > 0 ? ride.totalRitPrice.toLocaleString('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }) : "€0.00"}</p>
                            )}

                            {user.username !== ride.driverUsername ? (
                                <p>Rijstatus: Passagier</p>
                            ) : (
                                <p>Rijstatus: Bestuurder</p>
                            )}
                        </Link>
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// dit ride component 24/7 hierboven geplaatst!
function MyRides() {
    const token = localStorage.getItem('token');

    const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);

    const [rides, setRides] = useState([]);
    const [rideItemClicked, setRideItemClicked] = useState(false);

    useEffect(() => {
        async function fetchRides() {
            try {
                const username = isAuth && user.username ? user.username : '';

                const response = await axios.get(`http://localhost:8080/users/${username}/rides`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setRides(response.data);

            } catch (error) {
                console.error(error);
            }
        }

        fetchRides();
    }, []);


    // 24/7 dit was de goede hieronder!
//     return (
//         <div className="outer-content-container">
//             <div className="inner-content-container">
//                 <div className="rides-overview-page">
//                     <Switch>
//                         <Route path="/rides/:id">
//                             <RidePageTest/>
//                         </Route>
//                     </Switch>
//
//                     <h1>Mijn ritten</h1>
//
//                     {rides.length === 0 && (
//                         <p>
//                             Er zijn nog geen ritten geplant
//                         </p>
//                     )}
//
//                     {rides.length > 0 && (
//                         <div className="rides-container">
//                             {rides.map((ride) => {
//                                 return (
//                                     <React.Fragment key={ride.id}>
//                                         {!rideItemClicked && (
//                                             <Link
//                                                 to={`/rides/${ride.id}`}
//                                                 key={ride.id}
//                                                 className="ride-item"
//                                                 onClick={() => setRideItemClicked(true)}
//                                             >
//                                                 <h2>{ride.pickUpLocation} - {ride.destination}</h2>
//                                                 <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
//                                                 <p>Vertrek
//                                                     tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
//                                                         hour: '2-digit',
//                                                         minute: '2-digit',
//                                                         hour12: false
//                                                     })}</p>
//                                                 <p>Aankomst tijd: {ride.eta.substring(0, 5)}</p>
//
//                                                 {user.username === ride.driverUsername && (
//                                                     <p>Aantal vrije stoelen: {ride.availableSpots}</p>)}
//
//                                                 {user.username === ride.driverUsername && (
//                                                     <p>Gereserveerde stoelen: {ride.pax}</p>
//                                                 )}
//
//                                                 <p>Prijs per
//                                                     persoon: {ride.pricePerPerson && ride.pricePerPerson.toLocaleString('nl-NL', {
//                                                         style: 'currency',
//                                                         currency: 'EUR'
//                                                     })}</p>
//
//                                                 {user.username === ride.driverUsername && (
//                                                     <p>Totaal
//                                                         prijs: {ride.totalRitPrice > 0 ? ride.totalRitPrice.toLocaleString('nl-NL', {
//                                                             style: 'currency',
//                                                             currency: 'EUR'
//                                                         }) : "€0.00"}</p>
//                                                 )}
//
//                                                 {user.username !== ride.driverUsername ? (
//                                                     <p>Rijstatus: Passagier</p>
//                                                 ) : (
//                                                     <p>Rijstatus: Bestuurder</p>
//                                                 )}
//
//                                             </Link>
//                                         )}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

    //hieronder 24/7
    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <main className="rides-overview-page">
                    <Switch>
                        <Route path="/rides/:id">
                            <RidePageTest/>
                        </Route>
                    </Switch>
                    <header>
                        <h1>Mijn ritten</h1>
                    </header>
                    {rides.length === 0 && (
                        <p>
                            Er zijn nog geen ritten geplant
                        </p>
                    )}
                    {rides.length > 0 && <RidesComponent {...{rides, user, rideItemClicked, setRideItemClicked}} />}
                </main>
            </div>
        </div>
    );
}

export default MyRides;



