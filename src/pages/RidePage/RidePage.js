import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import './ridePage.css';
import standard_profile_img from '../../assets/sustainability.jpg';

function RidePage() {
    const token = localStorage.getItem('token');
    const {user} = useContext(AuthContext);
    const {id, rideId} = useParams();

    const [rideData, setRideData] = useState({});
    const [currentData, setCurrentData] = useState("");
    const [eta, setETA] = useState('');

    const [driverData, setDriverData] = useState({});
    const [reservationInfo, setReservationInfo] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const [error, setError] = useState(null);

    let datum = [];

    const [uploadedImage, setUploadedImage] = useState(null);
    const [passengerImages, setPassengerImages] = useState({});

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pax = queryParams.get('pax');
    console.log("pax: ", rideData.pax);

    useEffect(() => {
        async function fetchData() {
            setError(null);
            setErrorMessage(null);
            try {
                const rideResponse = await axios.get(`http://localhost:8080/rides/${id}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                console.log(rideResponse.data);
                setRideData(rideResponse.data);
                // datum = rideResponse.data.departureDateTime.split("T");
                // setCurrentData(datum[1]);
                const departureTime = rideResponse.data.departureDateTime.split("T")[1].slice(0, 5);
                setCurrentData(departureTime);

                const etaTime = rideResponse.data.eta.substring(0, 5);
                console.log(etaTime)
                setETA(etaTime);

                if (rideResponse.data.driverUsername) {
                    const driverResponse = await axios.get(`http://localhost:8080/users/${rideResponse.data.driverUsername}`, {
                        headers: {'Authorization': `Bearer ${token}`}
                    });
                    setDriverData(driverResponse.data);
                }
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            setError("Deze rit is verwijderd");
                            break;
                        case 409:
                            setErrorMessage("Deze rit is al geselecteerd door de gebruiker");
                            break;
                        default:
                            setError("Er is iets fout gegaan, probeer het opnieuw.");
                    }
                } else {
                    setError("Er is iets fout gegaan, probeer het opnieuw.");
                }
                console.error(error);
            }
        }

        fetchData();
    }, [id]);


    const history = useHistory();

    async function handleSelectRitClick() {
        setError(null);
        setErrorMessage(null);

        console.log("username: " + user.username);
        console.log("pax : ", pax);
        try {
            await axios.post(`http://localhost:8080/rides/${id}/${user.username}/${pax}`, {}, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            history.push('/confirmation/reservation/success');
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        setErrorMessage("Deze rit is al geselecteerd door de gebruiker");
                        break;
                    // Je kunt meer cases toevoegen voor andere statuscodes die je verwacht
                    default:
                        setError("Er is iets fout gegaan, probeer het opnieuw.");
                        history.push('/confirmation/reservation/failure');
                }
            } else {
                setError("Er is iets fout gegaan, probeer het opnieuw.");
                history.push('/confirmation/reservation/failure');
            }
            console.error(error);
        }
    }

    async function handleAnnuleerRitClick() {
        setError(null);
        setErrorMessage(null);
        console.log("idddd: " + id);
        try {
            await axios.delete(`http://localhost:8080/rides/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            history.push('/confirmation/rideRemoved/success');
        } catch (error) {
            setError("Er is iets fout gegaan, probeer het opnieuw.");
            history.push('/confirmation/rideRemoved/failure');
            console.error(error);
        }
    }

    async function handleCancelRitAlsPassagierClick() {
        setError(null);
        setErrorMessage(null);
        try {
            await axios.delete(`http://localhost:8080/rides/${rideData.id}/users/${user.username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const response = await axios.get(`http://localhost:8080/rides/${rideData.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

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
            setError(null);
            setErrorMessage(null);
            if (driverData.fileName) {
                try {
                    const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${driverData.fileName}`, {
                        responseType: 'blob',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
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
            setError(null);
            setErrorMessage(null);

            if (rideData.users.length > 1) {
                for (let passenger of rideData.users) {
                    if (passenger.username !== driverData.username) {
                        try {
                            // Haal eerst de gebruikersinformatie op
                            const userResponse = await axios.get(`http://localhost:8080/users/${passenger.username}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            });
                            const user = userResponse.data;

                            // Gebruik de bestandsnaam van de gebruiker om de afbeelding te downloaden
                            const response = await axios.get(`http://localhost:8080/users/downloadFromDB/${user.fileName}`, {
                                responseType: 'blob',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
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
            setError(null);
            setErrorMessage(null);

            try {
                const response = await axios.get(`http://localhost:8080/rides/${id}/users/${user.username}/reservationInfo`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log(response.data);
                setReservationInfo(response.data);
            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            setError("Reserveringsinformatie niet gevonden");
                            break;
                        case 403:
                            setError("Gebruiker niet in de rit");
                            break;
                        default:
                            setError("Er is iets fout gegaan, probeer het opnieuw.");
                    }
                } else {
                    setError("Er is iets fout gegaan, probeer het opnieuw.");
                }
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

                {error ? (
                    <h2>{error}</h2>
                ) : (

                    <div className="product-page">
                        <h1>Reisdetails (RidePage id: {id})</h1>

                        {Object.keys(rideData).length > 0 &&
                            <div>
                                {console.log(rideData)}
                                <h4>reisdatum: {new Date(rideData.departureDateTime).toLocaleDateString()}</h4>
                                <section className="ride-summary">
                                    <div className="top-box">
                            <span className="summary-block1">
                                <p>
                                    {currentData}
                                </p>
                                <p>{rideData.pickUpLocation}</p>
                                {/*<p>{rideData.eta}*</p>*/}
                                <p>{eta}*</p>

                                <p>{rideData.destination}</p>
                            </span>
                                        <span className="summary-block2">
                                <p className="ride-page-price">Prijs per
                                    persoon: {(rideData.pricePerPerson).toLocaleString('nl-NL', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}</p>

                                            {user && rideData.driverUsername !== user.username && rideData.users && !rideData.users.find(u => u.username === user.username) && (
                                                <div>
                                                    <p>aantal personen: {pax}</p>
                                                    <p>
                                                        Totaal
                                                        prijs: {(rideData.pricePerPerson * pax).toLocaleString('nl-NL', {
                                                        style: 'currency',
                                                        currency: 'EUR'
                                                    })}
                                                    </p>

                                                </div>
                                            )}

                                            {user && rideData.driverUsername !== user.username && rideData.users && rideData.users.find(u => u.username === user.username) && (
                                                <div>
                                                    <p>Gereserveerde stoelen: {reservationInfo?.reservedSpots} </p>
                                                    <p>Totaal
                                                        prijs: {reservationInfo?.totalPrice && reservationInfo.totalPrice.toLocaleString('nl-NL', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        })}</p>
                                                </div>
                                            )}


                                            {user && rideData.driverUsername === user.username && (
                                                <div>
                                                    <p>Aantal passagiers: {rideData.pax}</p>
                                                    <p>Rit
                                                        opbrengst: {rideData.totalRitPrice > 0 ? rideData.totalRitPrice.toLocaleString('nl-NL', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        }) : '€0.00'}</p>
                                                </div>)}
                            </span>
                                    </div>
                                    <div id="eta">
                                        <p>* Verwachte aankomst tijd</p>
                                    </div>


                                    <div className="driver-profile-box">
                                        <Link to={`/profile/${driverData.username}`}>
                                            {uploadedImage ? (
                                                <img
                                                    src={uploadedImage}
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
                                    <p>Vertrektijd: {new Date(rideData.departureDateTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</p>
                                    <p>Vertrekplaats: {rideData.pickUpLocation}</p>
                                    <p>Adres: {rideData.pickUpAddress} </p>
                                    <p>Aankomsttijd: {rideData.eta.substring(0, 5)}*</p>
                                    <p>Bestemming: {rideData.destination}</p>
                                    <p>Adres: {rideData.destinationAddress} </p>



                                    {user && rideData.driverUsername === user.username && (

                                        <p>Beschikbare stoelen: {rideData.availableSpots}</p>
                                    )}
                                    <p>Route: {rideData.route}</p>
                                    <p>Reis omschrijving: {rideData.addRideInfo}</p>

                                    {user && rideData.driverUsername === user.username && rideData.users && rideData.users.filter(passenger => passenger.username !== driverData.username).length > 0 && (
                                        <div>
                                            <h4>Passagiers:</h4>
                                            <div className="passenger-profile-box">
                                                {rideData.users
                                                    .filter(passenger => passenger.username !== driverData.username)
                                                    .map((passenger) => (
                                                        <div key={passenger.username} className="passenger-profile-box">
                                                            <Link to={`/profile/${passenger.username}`} className="profile-link">
                                                                {passengerImages[passenger.username] ? (
                                                                    <img
                                                                        src={passengerImages[passenger.username]}
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
                                <button onClick={handleCancelRitAlsPassagierClick}
                                        id="cancel-rit-als-passagier-btn">Cancel
                                    rit als passagier</button>
                            )}

                            {user && pax && rideData.driverUsername !== user.username && rideData.users && !rideData.users.find(u => u.username === user.username) && (
                                <button onClick={handleSelectRitClick} id="selecteer-rit-btn">Selecteer Rit!</button>
                            )}

                        </div>

                        {errorMessage && (
                            <p>{errorMessage}</p>
                        )}

                        <p className="home-page-link">Terug naar de <Link to="/">Homepagina</Link></p>

                    </div>
                )}

            </div>
        </ride>
    )
}

export default RidePage;