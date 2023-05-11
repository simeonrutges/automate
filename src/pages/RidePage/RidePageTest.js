import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import './ridePage.css';

function RidePage() {
    const [rideData, setRideData] = useState({});
    const {user} = useContext(AuthContext);
    const [currentData, setCurrentData] = useState("");

    const [driverData, setDriverData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null); // Nieuwe state variabele voor foutmeldingen

    const {id} = useParams();
    //useParams geeft alleen welke rit het is
    const {rideId} = useParams();

    let datum = [];
// GET request deze werkt!!!
//     useEffect(() => {
//         async function fetchRideData() {
//             try {
//                 const response = await axios.get(`http://localhost:8080/rides/${id}`);
//                 setRideData(response.data);
//                 datum = response.data.departureDateTime.split("T");
//                 setCurrentData(datum[1])
//                 console.log(response.data)
//
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//
//         fetchRideData()
//     }, [id]);


    useEffect(() => {
        async function fetchData() {
            try {
                const rideResponse = await axios.get(`http://localhost:8080/rides/${id}`);
                setRideData(rideResponse.data);
                datum = rideResponse.data.departureDateTime.split("T");
                setCurrentData(datum[1]);

                if (rideResponse.data.driverUsername) {
                    const driverResponse = await axios.get(`http://localhost:8080/users/${rideResponse.data.driverUsername}`);
                    setDriverData(driverResponse.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [id]);

/////////////
    // DELETE ride request
    // const history = useHistory();
    //
    // async function handleAnnuleerRitClick() {
    //     console.log("idddd: " + id);
    //     try {
    //         await axios.delete(`http://localhost:8080/rides/${id}`);
    //         history.push('/');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    //
    // // functie om huidige gebruiker aan de rit toe te voegen-->
    // async function handleSelectRitClick() {
    //     console.log("username: " + user.username);
    //     try {
    //         await axios.post(`http://localhost:8080/rides/${id}/${user.username}`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    /////////


    ///// test hierboven is sowieso  goed!
    const history = useHistory();

    async function handleSelectRitClick() {
        console.log("username: " + user.username);
        try {
            await axios.post(`http://localhost:8080/rides/${id}/${user.username}`);
            history.push('/confirmation/reservation/success');
        } catch (error) {
            if (error.response && error.response.status === 409) { // Hier vul je de statuscode in die je backend retourneert voor deze specifieke fout
                // Je kunt hier een specifiek bericht instellen of een variabele instellen die je later kunt gebruiken om de status van je knop te wijzigen
                // console.error("Deze rit is al geselecteerd door de gebruiker");
                setErrorMessage("Deze rit is al geselecteerd door de gebruiker"); // Zet de foutmelding in de state
            } else {
                console.error(error);
                history.push('/confirmation/reservation/failure');
            }
        }
    }

    async function handleAnnuleerRitClick() {
        console.log("idddd: " + id);
        try {
            await axios.delete(`http://localhost:8080/rides/${id}`);
            history.push('/confirmation/rideRemoved/success');
        } catch (error) {
            console.error(error);
            history.push('/confirmation/rideRemoved/failure');
        }
    }

/////

    console.log(driverData.username);

    ////
    async function handleCancelRitAlsPassagierClick() {
        try {
            await axios.delete(`http://localhost:8080/rides/${rideData.id}/users/${user.username}`);
            const response = await axios.get(`http://localhost:8080/rides/${rideData.id}`);
            if (response.status === 200) {
                setRideData(response.data);
            }
            history.push('/confirmation/reservationRemoved/success');
        } catch (error) {
            console.error("Er is iets fout gegaan bij het annuleren van de rit: ", error);
            history.push('/confirmation/reservationRemoved/failure');
        }
    }


    return (
        <ride className="outer-content-container">
            <div className="inner-content-container">

                <div className="product-page">
                    <h1>RidePageTestttt {id}</h1>


                    {Object.keys(rideData).length > 0 &&
                        <div>
                            {console.log(rideData)}
                            <p>reisdatum: {new Date(rideData.departureDateTime).toLocaleDateString()}</p>
                            <section className="ride-summary">
                                <div className="top-box">
                            <span className="summary-block1">
                                <p>
                                    {currentData}
                                </p>
                                <p>{rideData.pickUpLocation}</p>

                                <p>{rideData.eta}*</p>
                                {/*<p>{rideData.eta.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>*/}

                                <p>{rideData.destination}</p>
                            </span>
                                    <span className="summary-block2">
                                <p className="ride-page-price">Prijs per
                                    persoon: {(rideData.pricePerPerson).toLocaleString('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}</p>
                                <p>Aantal personen: {rideData.pax}</p>
                                <p>Totaal prijs: {rideData.totalRitPrice}</p>
                            </span>
                                </div>


                                <p>* Verwachte aankomst tijd</p>


                                <div className="driver-profile-box">
                                    {driverData.fileName && (
                                        <Link to={`/profile/${driverData.username}`}>
                                            <img
                                                src={`data:image/jpeg;base64,${driverData.docFile}`}
                                                alt="Profielfoto van de bestuurder"
                                                className="driver-profile-picture"
                                            />
                                        </Link>
                                    )}
                                    <Link to={`/profile/${driverData.username}`}>
                                        <p>{driverData.username}</p>
                                    </Link>
                                </div>


                            </section>
                            <section className="ride-info">
                                <p>Ophaal locatie: {rideData.pickUpLocation}</p>
                                <p>{new Date(rideData.departureDateTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}</p>
                                <p>Bestemming: {rideData.destination}</p>
                                <p>{rideData.eta}*</p>
                                <p>Aantal beschikbare plekken:{rideData.availableSpots}</p>
                                <p>Route: {rideData.route}</p>
                                <p>Reis omschrijving: {rideData.addRideInfo}</p>



                                {user && rideData.driverUsername === user.username && (
                                    <div className="driver-profile-box">
                                        {/*{driverData.fileName && (*/}
                                        {/*    <Link to={`/profile/${driverData.username}`}>*/}
                                        {/*        <img*/}
                                        {/*            src={`data:image/jpeg;base64,${driverData.docFile}`}*/}
                                        {/*            alt="Profielfoto van de bestuurder"*/}
                                        {/*            className="driver-profile-picture"*/}
                                        {/*        />*/}
                                        {/*    </Link>*/}
                                        {/*)}*/}
                                        {/*<Link to={`/profile/${driverData.username}`}>*/}
                                        {/*    <p>{driverData.username}</p>*/}
                                        {/*</Link>*/}

                                        <p>Passagiers:</p>

                                        {rideData.users && rideData.users
                                            .filter(passenger => passenger.username !== driverData.username)
                                            .map((passenger) => (
                                                <div key={passenger.username} className="passenger-profile-box">
                                                    <Link to={`/profile/${passenger.username}`}>
                                                        <img
                                                            src={`data:image/jpeg;base64,${passenger.docFile}`}
                                                            alt="Profielfoto van passagier"
                                                            className="driver-profile-picture"
                                                        />
                                                        <p>{passenger.username}</p>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}





                            </section>
                        </div>
                    }

                    <div className="buttons">


                        {user && rideData.driverUsername === user.username && (
                            <button onClick={handleAnnuleerRitClick} id="annuleer-rit-btn">Annuleer rit</button>
                        )}

                        {user && rideData.driverUsername !== user.username && rideData.users && rideData.users.find(u => u.username === user.username) && (
                            <button onClick={handleCancelRitAlsPassagierClick} id="cancel-rit-als-passagier-btn">Cancel
                                rit als passagier</button>
                        )}
                        {user && rideData.driverUsername !== user.username && rideData.users && !rideData.users.find(u => u.username === user.username) && (
                            <button onClick={handleSelectRitClick} id="selecteer-rit-btn">Selecteer Rit!</button>
                        )}


                        {/*{user && rideData.driverUsername !== user.username && (*/}
                        {/*    <button onClick={handleSelectRitClick} id="selecteer-rit-btn">Selecteer Rit!</button>*/}
                        {/*)}*/}


                    </div>

                    {errorMessage && (
                        <p>{errorMessage}</p>
                    )}

                    <p className="home-page-link">Terug naar de <Link to="/">Homepagina</Link></p>

                </div>
            </div>
        </ride>
    )
}

export default RidePage;