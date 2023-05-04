import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {Link, Route, Switch} from "react-router-dom";
import RidePageTest from "../RidePage/RidePageTest";

function MyRides() {
    const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);

    const [rides, setRides] = useState([]);
    // const username = 'yourUserId'; // Replace this with the actual user ID you want to use
    const [rideItemClicked, setRideItemClicked] = useState(false);

    useEffect(() => {
    async function fetchRides() {
        try {
            const username = isAuth && user.username ? user.username : '';
            console.log("username: " + username);

            const response = await axios.get(`http://localhost:8080/users/${username}/rides`);
            setRides(response.data);
            console.log(rides);

        } catch (error) {
            console.error(error);
        }
    }
        fetchRides();
    }, []);

    // hieronder test



    // return (
//         <div>
//             <h1>Mijn ritten</h1>
//             <div>
//                 {rides.map((ride) => (
//                     <div key={ride.id} className="ride">
//                         {/* Display relevant ride information */}
//                         <h3>Destination: {ride.destination}</h3>
//                         <p>Vertrek: {ride.pickUpLocation}</p>
//                         {/*<p>Aankomst: {ride.arrival}</p>*/}
//                         {/*<p>Datum: {ride.date}</p>*/}
//                         {/*<p>Tijd: {ride.time}</p>*/}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




//         <rides className="outer-content-container">
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
//                         // <div>
//
//                             <div className="rides-container">
//                                 {rides.map((ride) => {
//                                     return (
//                                         <React.Fragment key={ride.id}>
//                                             {!rideItemClicked && (
//                                                 <Link
//                                                     to={`/rides/${ride.id}`}
//                                                     key={ride.id}
//                                                     className="ride-item"
//                                                     onClick={() => setRideItemClicked(true)}
//                                                 >
//                                                     <h2>{ride.pickUpLocation} - {ride.destination}</h2>
//                                                     <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
//                                                     <p>Vertrek
//                                                         tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
//                                                             hour: '2-digit',
//                                                             minute: '2-digit',
//                                                             hour12: false
//                                                         })}</p>
//                                                     <p>Aankomst tijd: {ride.eta}</p>
//                                                     <p>Prijs per persoon: {ride.pricePerPerson} euro</p>
//                                                     <p>Totaal prijs: {ride.totalRitPrice} euro</p>
//                                                     <p>Aantal personen: {ride.pax}</p>
//                                                     {user.username !== ride.driverUsername ? (
//                                                         <div>
//                                                             <p>Ik ben passagier!</p>
//                                                         <p>Stuur {ride.driverUsername} een bericht!</p>
//                                                         </div>
//                                                     ) : (
//                                                         <p>Ik rij!</p>
//                                                     )}
//
//                                                 </Link>
//                                             )}
//                                         </React.Fragment>
//                                     );
//                                 })}
//
//
//                             </div>
//                         // </div>
//                     )}
//                 </div>
//             </div>
//         </rides>
//     );
//
//
// }
//
// export default MyRides;

    return (
        <div className="outer-content-container">
            <div className="inner-content-container">
                <div className="rides-overview-page">
                    <Switch>
                        <Route path="/rides/:id">
                            <RidePageTest />
                        </Route>
                    </Switch>

                    <h1>Mijn ritten</h1>

                    {rides.length === 0 && (
                        <p>
                            Er zijn nog geen ritten geplant
                        </p>
                    )}

                    {rides.length > 0 && (
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
                                                {user.username !== ride.driverUsername ? (
                                                    <div>
                                                        <p>Ik ben passagier!</p>
                                                        <p>Stuur {ride.driverUsername} een bericht!</p>
                                                    </div>
                                                ) : (
                                                    <p>Ik rij!</p>
                                                )}

                                            </Link>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default MyRides;



