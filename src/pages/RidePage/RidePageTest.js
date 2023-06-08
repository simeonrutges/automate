import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import './ridePage.css';
import standard_profile_img from '../../assets/sustainability.jpg';

function RidePage() {
    const [rideData, setRideData] = useState({});
    const {user} = useContext(AuthContext);
    const [currentData, setCurrentData] = useState("");

    const [driverData, setDriverData] = useState({});
    const [reservationInfo, setReservationInfo] = useState(null);


    const [errorMessage, setErrorMessage] = useState(null);

    const {id} = useParams();
    //useParams geeft alleen welke rit het is
    const {rideId} = useParams();


    let datum = [];

    const [uploadedImage, setUploadedImage] = useState(null);
    const [passengerImages, setPassengerImages] = useState({});
// 6-6
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pax = queryParams.get('pax');
    console.log("pax: ", rideData.pax);
//
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("(useParams) id : ", id)
                const rideResponse = await axios.get(`http://localhost:8080/rides/${id}`);
                console.log("riderespondse.data : ", rideResponse.data);
                setRideData(rideResponse.data);
                datum = rideResponse.data.departureDateTime.split("T");
                console.log(datum);
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


    const history = useHistory();

    async function handleSelectRitClick() {
        console.log("username: " + user.username);
        console.log("pax : ", pax);
        try {
            //moet nog PAX bij! vuia Useparams?
            await axios.post(`http://localhost:8080/rides/${id}/${user.username}/${pax}`);
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

    console.log(driverData.username);

    // async function handleAnnuleerRitClick() {
    //     console.log("idddd: " + id);
    //     try {
    //         await axios.delete(`http://localhost:8080/rides/${id}`);
    //
    //         // Stuur een notificatie naar elke passagier
    //         for (const passenger of rideData.users) {
    //             if (passenger.username !== driverData.username) {
    //                 // Voorkom dat er een notificatie wordt gestuurd naar de bestuurder van de rit
    //                 await axios.post(`http://localhost:8080/notifications`, {
    //                     sender: user.username, // De huidige ingelogde gebruiker is de zender
    //                     receiver: passenger.username, // De passagier is de ontvanger
    //                     type: 'RIDE_CANCELLED_BY_DRIVER',
    //                     sentDate: new Date(),
    //                     isRead: false,
    //                     rideId: id,
    //                 });
    //             }
    //         }
    //
    //         history.push('/confirmation/rideRemoved/success');
    //     } catch (error) {
    //         console.error(error);
    //         history.push('/confirmation/rideRemoved/failure');
    //     }
    // }

    ////////////// hierboven is een test 18-05 nog verder afmaken!!!

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

    useEffect(() => {
        async function fetchProfileImage() {
            if (driverData.fileName) {
                try {
                    const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${driverData.fileName}`, {
                        responseType: 'blob',
                    });
                    const imageUrl = (URL.createObjectURL(response.data));
                    setUploadedImage(imageUrl);

                } catch (error) {
                    console.error('Error fetching profile image:', error);
                }
            }
        }
        fetchProfileImage();
    }, [driverData]);

    // passagierImage
    useEffect(() => {
        async function fetchAllPassengerImages() {
            if (rideData.users) {
                for (let passenger of rideData.users) {
                    if (passenger.username !== driverData.username) {
                        try {
                            // Haal eerst de gebruikersinformatie op
                            const userResponse = await axios.get(`http://localhost:8080/users/${passenger.username}`);
                            const user = userResponse.data;

                            // Gebruik de bestandsnaam van de gebruiker om de afbeelding te downloaden
                            const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${user.fileName}`, {
                                responseType: 'blob',
                            });
                            const imageUrl = URL.createObjectURL(response.data);
                            setPassengerImages(prevImages => ({...prevImages, [passenger.username]: imageUrl}));
                        } catch (error) {
                            console.error('Error fetching passenger image:', error);
                        }
                    }
                }
            }
        }

        fetchAllPassengerImages();
    }, [rideData.users, driverData.username]);


    useEffect(() => {
        async function fetchReservationInfo() {
            try {
                console.log(user.username);
                console.log("rideId: ", id)
                const response = await axios.get(`http://localhost:8080/rides/${id}/users/${user.username}/reservationInfo`);

                // Verwerk of stel de ontvangen gegevens in de staat van uw component
                console.log(response.data);
                setReservationInfo(response.data);
            } catch (error) {
                console.error('Er is een fout opgetreden:', error);
            }
        }

        fetchReservationInfo();
    }, [rideId, user.username]);

    // Nu kun je de reservationInfo overal in deze component gebruiken.
    // Zorg er wel voor dat je controleert of het nog null is voordat je het gebruikt,
    // omdat het asynchroon wordt ingesteld.
    if (reservationInfo) {
        console.log(reservationInfo.totalPrice);
        console.log(reservationInfo.reservedSpots);
    }


    return (
        <ride className="outer-content-container">
            <div className="inner-content-container">

                <div className="product-page">
                    <h1>RidePageTest.js {id}</h1>

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

                                        {/*//*/}
                                        {/*test hier in de avond!!!*/}
                                        {user && rideData.driverUsername !== user.username && rideData.users && !rideData.users.find(u => u.username === user.username) &&(
                                            <div>
                                            <p>hier komt de rest van de info VOOR de pass geboekt heeft</p>
                                                <p>aantal personen: {pax}</p>
                                                {/*<p>totaal prijs: {rideData.pricePerPerson * pax}</p>*/}
                                                <p>
                                                    Totaal prijs: {(rideData.pricePerPerson * pax).toLocaleString('nl-NL', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                })}
                                                </p>

                                            </div>
                                        )}
                                        {/*//*/}


                                        {/*{user && rideData.driverUsername !== user.username && rideData.users && rideData.users.find(u => u.username === user.username) && (*/}
                                        {/*    <div>*/}
                                        {/*    <p>Gereserveerde stoelen: {reservationInfo.reservedSpots} </p>*/}
                                        {/*    /!*<p>Totaal prijs: {reservationInfo.totalPrice}</p>*!/*/}
                                        {/*        <p>Totaal prijs: {(reservationInfo?.totalPrice).toLocaleString('nl-NL', {*/}
                                        {/*            style: 'currency',*/}
                                        {/*            currency: 'EUR'*/}
                                        {/*        })}</p>*/}

                                        {/*    </div>)}*/}
                                        {user && rideData.driverUsername !== user.username && rideData.users && rideData.users.find(u => u.username === user.username) && (
                                            <div>
                                                <p>Gereserveerde stoelen: {reservationInfo?.reservedSpots} </p>
                                                <p>Totaal prijs: {reservationInfo?.totalPrice && reservationInfo.totalPrice.toLocaleString('nl-NL', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                })}</p>
                                            </div>
                                        )}


                                        {user && rideData.driverUsername === user.username && (
                                <div>
                                    <p>Aantal passagiers: {rideData.pax}</p>
                                {/*<p>Totaal prijs: {rideData.totalRitPrice}</p>*/}
                                    <p>Rit opbrengst: {rideData.totalRitPrice && rideData.totalRitPrice.toLocaleString('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}</p>

                                </div>)}
                            </span>
                                </div>
                                <p>* Verwachte aankomst tijd</p>


                                <div className="driver-profile-box">
                                    <Link to={`/profile/${driverData.username}`}>
                                        {uploadedImage ? (
                                            <img
                                                src={uploadedImage} // Gebruik hier de URL van de opgehaalde afbeelding
                                                alt="Profielfoto van de bestuurder"
                                                className="driver-profile-picture"
                                            />
                                        ) : (
                                            <img
                                                src={standard_profile_img}
                                                alt="Standaard profielfoto van de bestuurder"
                                                className="driver-profile-picture"
                                            />
                                        )}
                                    </Link>
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
                                {/*<p>Aantal beschikbare plekken:{rideData.availableSpots}</p>*/}


                                {user && rideData.driverUsername === user.username && (

                                        <p>Vrij stoelen: {rideData.availableSpots}</p>
                                    )}
                                <p>Route: {rideData.route}</p>
                                <p>Reis omschrijving: {rideData.addRideInfo}</p>

                                {user && rideData.driverUsername === user.username && rideData.users && rideData.users.filter(passenger => passenger.username !== driverData.username).length > 0 && (
                                    <div className="driver-profile-box">
                                        <p>Passagiers:</p>
                                        {rideData.users
                                            .filter(passenger => passenger.username !== driverData.username)
                                            .map((passenger) => (
                                                <div key={passenger.username} className="passenger-profile-box">
                                                    <Link to={`/profile/${passenger.username}`}>
                                                        {passengerImages[passenger.username] ? (
                                                            <img
                                                                src={passengerImages[passenger.username]} // Gebruik hier de URL van de opgehaalde afbeelding
                                                                alt="Profielfoto van de passagier"
                                                                className="driver-profile-picture"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={standard_profile_img}
                                                                alt="Standaard profielfoto van de bestuurder"
                                                                className="driver-profile-picture"
                                                            />
                                                        )}
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