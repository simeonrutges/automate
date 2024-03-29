import React, {useContext, useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import './home.css';
import picture from '../../assets/shutterstock_2122349819.jpg';
import picture_save from '../../assets/money-saving-tips-1622109964.jpg';
import img_environmental_sustainability from '../../assets/sustainability.jpg';
import img_conviviality from '../../assets/conviviality.jpg';
import FormInput from "../../components/formInput/FormInput";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";

function Home() {
    const {isAuth, isBestuurder, isPassagier, user} = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const history = useHistory();

    // voor het switchen van de forms; 'rideAlong' or 'selfDrive'
    const [activeForm, setActiveForm] = useState('rideAlong');

    // selfdrive form
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [route, setRoute] = useState('');
    const [addRideInfo, setAddRideInfo] = useState('');

    const [departureTime, setDepartureTime] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const departureDateTime = (`${departureDate}T${departureTime}`);

    const [pricePerPerson, setPricePerPerson] = useState('');
    const [availableSpots, setAvailableSpots] = useState('');
    const [eta, setEta] = useState('');
    const [pickUpAddress, setPickUpAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');

    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [addRideInfoError, setAddRideInfoError] = useState("");
    const [routeError, setRouteError] = useState("");

    const [dateTimeError, setDateTimeError] = useState(null);
    const [etaError, setEtaError] = useState("");
    const [departureDateError, setDepartureDateError] = useState("");

    const [availableSpotsError, setAvailableSpotsError] = useState("");
    const [pricePerPersonError, setPricePerPersonError] = useState("");

    function handleAvailableSpotsChange(e) {
        const enteredValue = parseInt(e.target.value);
        setAvailableSpots(enteredValue);
    }

    function handlePricePerPersonChange(e) {
        const enteredValue = parseFloat(e.target.value);
        setPricePerPerson(enteredValue);
    }

    const handlePickUpLocationChange = (e) => {
        setPickUpLocation(e.target.value);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleRouteChange = (e) => {
        setRoute(e.target.value);
    };

    const handleAddRideInfoChange = (e) => {
        setAddRideInfo(e.target.value);
    };

    const handleDepartureTimeChange = (e) => {
        setDepartureTime(e.target.value);
    };

    const handleDepartureDateChange = (e) => {
        setDepartureDate(e.target.value);
    };

    const padZero = (num) => {
        return num.toString().padStart(2, '0');
    }

    const handleEtaChange = (e) => {
        setEta(e.target.value);
    };
    const handlePickUpAddressChange = (e) => {
        setPickUpAddress(e.target.value);
    };

    const handleDestinationAddressChange = (e) => {
        setDestinationAddress(e.target.value);
    };

    const setDepartureDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);

        // Get the timezone offset for the user's timezone in minutes
        const timeZoneOffset = dateTime.getTimezoneOffset();
        console.log(timeZoneOffset);
        // Adjust the datetime for the user's timezone
        const userDateTime = timeZoneOffset / 60;
        console.log(userDateTime);
        const currentDateTime = new Date(Date.now() + userDateTime * 60 * 1000);
        console.log(currentDateTime);
        // Format the datetime into a string that matches the LocalDateTime format expected by the server
        const formattedDateTime = `${currentDateTime.getFullYear()}-${padZero(currentDateTime.getMonth() + 1)}-${padZero(currentDateTime.getDate())}T${padZero(currentDateTime.getHours())}:${padZero(currentDateTime.getMinutes())}`;
        console.log(formattedDateTime);

        setDepartureDateTime(formattedDateTime);
    }

    async function handleSubmitSelfDrive(e) {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        if (pricePerPerson < 3.00) {
            setPricePerPersonError("De prijs per persoon moet minimaal 3,00 euro zijn.");
            return;
        } else {
            setPricePerPersonError("");
        }

        if (availableSpots < 1 || availableSpots > 5) {
            setAvailableSpotsError("Het aantal beschikbare plaatsen moet tussen 1 en 5 zijn.");
            return;
        } else {
            setAvailableSpotsError("");
        }

        if (route.length > 250) {
            setRouteError("De route informatie is te lang. Maximum lengte is 250 tekens.");
            return;
        } else {
            setRouteError("");
        }

        if (addRideInfo.length > 500) {
            setAddRideInfoError("Extra ritinformatie is te lang. Maximum lengte is 500 tekens.");
            return;
        } else {
            setAddRideInfoError("");
        }

        const now = new Date();
        const enteredDateTime = new Date(departureDateTime);

        if (enteredDateTime <= now) {
            setDateTimeError("De gekozen vertrektijd ligt in het verleden. Selecteer een vertrektijd in de toekomst.");
            return;
        } else {
            setDateTimeError("");
        }

        // ETA error. Haal de uren en minuten uit de eta
        const [etaHours, etaMinutes] = eta.split(':').map(Number);
        const enteredHours = enteredDateTime.getHours();
        const enteredMinutes = enteredDateTime.getMinutes();

        if (etaHours < enteredHours || (etaHours === enteredHours && etaMinutes <= enteredMinutes)) {
            setEtaError("De geschatte aankomsttijd is ongeldig. Zorg ervoor dat het later is dan de vertrektijd.");
            return;
        } else {
            setEtaError("");
        }

        try {
            const username = isAuth && user.username ? user.username : '';

            const result = await axios.post('http://localhost:8080/rides', {
                pickUpLocation: pickUpLocation,
                destination: destination,
                route: route,
                addRideInfo: addRideInfo,
                departureDateTime: departureDateTime,
                pricePerPerson: pricePerPerson,
                availableSpots: availableSpots,
                eta: eta,
                driverUsername: username,
                pickUpAddress: pickUpAddress,
                destinationAddress: destinationAddress
            }, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            // Add the current user to the list of users for the ride
            const rideId = result.data.id;
            // pax = 0 because the user is driver and not an passenger
            await axios.post(`http://localhost:8080/rides/${rideId}/${username}/${0}`, {}, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const id = result.data.id;

            history.push(`/ride/${id}`);
        } catch (e) {
            console.error(e);
            if (e.response && e.response.data) {
                console.error('Server response:', e.response.data);

            }
            toggleError(true);
        }
        toggleLoading(false);
    }

    //RideAlong-form
    const [pax, setPax] = useState('');

    const handleSubmitRideAlong = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        if (pax < 1 || pax > 5) {
            alert("Het aantal reizigers moet tussen 1 en 5 liggen.");
            return;
        }
        // Controleer of de gekozen reisdatum in het verleden ligt:
        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);

        const chosenDate = new Date(departureDate);

        if (chosenDate < nowDate) {
            setDepartureDateError("De gekozen reisdatum ligt in het verleden. Selecteer een reisdatum die vandaag of in de toekomst ligt.");
            return;
        } else {
            setDepartureDateError("");
        }

        try {

            const result = await axios.get('http://localhost:8080/rides', {
                params: {
                    pickUpLocation: pickUpLocation,
                    destination: destination,
                    pax: pax,
                    departureDate: departureDate,
                },
                headers: {
                    "Content-Type": 'application/json',
                }
            });

            history.push(`/rides?pickUpLocation=${pickUpLocation}&destination=${destination}&pax=${pax}&departureDate=${departureDate}`);

        } catch (e) {
            console.error(e.response.data);
            toggleError(true);
        }

        toggleLoading(false);
    }

    const handleSelfDriveClick = () => {

        if (!isAuth) {
            history.push('/signin');
            return;
        }
        if (isPassagier && isBestuurder) {
            setActiveForm('selfDrive');
        }
        if (!isBestuurder && isAuth) {
            alert("Je moet een BESTUURDER zijn om dit te kunnen doen.");
            return;
        }
        setActiveForm('selfDrive');
    }

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get('section');

        if (section === 'how-it-works') {
            const element = document.getElementById('how-it-works');
            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }
    }, [location]);

    return (
        <>
            <header className="outer-content-container">
                <img src={picture} alt="auto door bos" className="cover-img"/>
                <div className="header-text">
                    <h1 id="header-slogan">De slimme keuze voor milieubewuste reizigers</h1>
                </div>
                <div className="inner-content-container">

                    <div className="form-container">
                        <div className="search-box">
                            <button className={`function-switch-button ${activeForm === 'selfDrive' ? 'active' : ''}`}
                                    type="button" onClick={handleSelfDriveClick}>Zelf rijden
                            </button>
                            <button className={`function-switch-button ${activeForm === 'rideAlong' ? 'active' : ''}`}
                                    type="button" onClick={() => setActiveForm('rideAlong')}>Rij mee
                            </button>
                        </div>

                        {activeForm === 'selfDrive' ? (
                                <form onSubmit={handleSubmitSelfDrive}>
                                    <FormInput id="pickUpLocation" labelText="Vertrek:" inputType="text"
                                               value={pickUpLocation} onChange={handlePickUpLocationChange} required
                                               placeholder="Utrecht "/>
                                    <FormInput id="pickUpAddress" labelText="Adres:" inputType="text"
                                               value={pickUpAddress} onChange={handlePickUpAddressChange} required
                                               placeholder="Straatweg 16 / Station"/>
                                    <FormInput id="destination" labelText="Bestemming:" inputType="text" value={destination}
                                               onChange={handleDestinationChange} required placeholder="Amsterdam"/>
                                    <FormInput id="destinationAddress" labelText="Adres:" inputType="text"
                                               value={destinationAddress}
                                               onChange={handleDestinationAddressChange} required
                                               placeholder="De Boelelaan 519 / Station Zuid"/>
                                    <FormInput id="route" labelText="Route:" inputType="text" value={route}
                                               onChange={handleRouteChange} placeholder="via Hilversum, A27 en A1 "/>
                                    {routeError && <p className="error">{routeError}</p>}
                                    <FormInput id="addRideInfo" labelText="Extra ritinformatie:" inputType="text"
                                               value={addRideInfo} onChange={handleAddRideInfoChange}
                                               placeholder="We stoppen in Hilversum voor koffie"/>
                                    {addRideInfoError && <p className="error">{addRideInfoError}</p>}
                                    <FormInput id="departureTime" labelText="Vertrektijd:" inputType="time"
                                               value={departureTime} onChange={handleDepartureTimeChange} required/>
                                    <FormInput id="departureDate" labelText="Vertrekdatum:" inputType="date"
                                               value={departureDate} onChange={handleDepartureDateChange} required/>
                                    {dateTimeError && <div className="error">{dateTimeError}</div>}

                                    <FormInput id="pricePerPerson" labelText="Prijs per persoon:" inputType="number" min="3"
                                               step="0.01" value={pricePerPerson} onChange={handlePricePerPersonChange}
                                               required placeholder="min. 3 euro "/>
                                    {pricePerPersonError && <div className="error">{pricePerPersonError}</div>}

                                    <FormInput id="availableSpots" labelText="Beschikbare plaatsen:" inputType="number"
                                               min="1" max="5" step="1" value={availableSpots}
                                               onChange={handleAvailableSpotsChange} required placeholder="min.1, max.5"/>
                                    {availableSpotsError && <div className="error">{availableSpotsError}</div>}
                                    <FormInput id="eta" labelText="Geschatte aankomsttijd:" inputType="time" value={eta}
                                               onChange={handleEtaChange} required placeholder="Utrecht "/>
                                    {etaError && <div className="error">{etaError}</div>}

                                    <button type="submit">Plaats rit</button>
                                </form>
                            )
                            : (
                                <form onSubmit={handleSubmitRideAlong}>
                                    <FormInput id="pickUpLocation" labelText="Vertrekplaats:" inputType="text"
                                               value={pickUpLocation}
                                               onChange={e => setPickUpLocation(e.target.value)} required
                                               placeholder="Utrecht "/>

                                    <FormInput id="destination" labelText="Bestemming:" inputType="text"
                                               value={destination} onChange={e => setDestination(e.target.value)}
                                               required placeholder="Alkmaar "/>

                                    <FormInput id="pax" labelText="Aantal reizigers:" inputType="number" min="1" max="5"
                                               step="1" value={pax}
                                               onChange={e => setPax(e.target.value)} required
                                               placeholder="min. 1, max. 5"/>
                                    {pax < 1 || pax > 5 &&
                                        <div className="error">Het aantal reizigers moet tussen 1 en 5 liggen.</div>}

                                    <FormInput id="departureDate" labelText="Reisdatum:" inputType="date"
                                               value={departureDate} onChange={e => setDepartureDate(e.target.value)}
                                               required/>
                                    {departureDateError && <div className="error">{departureDateError}</div>}

                                    <button type="submit">Zoeken</button>
                                </form>
                            )}
                    </div>

                </div>
            </header>

            <main>
                <section id="pros" className="outer-content-container">
                    <div className="inner-content-container default-area-padding">
                        <article className="benefit cost-saving">
                <span className="benefit__image-wrapper">
                     <img src={picture_save} alt="4 stacks of coins with the word 'save' on them"/>
                </span>
                            <div className="benefit__info-container">
                                <h4>Kostenbesparend</h4>
                                <p>Bespaar geld en deel je rit met anderen. Carpoolen is de perfecte manier om je
                                    uitgaven voor brandstof te verminderen en de kosten voor het onderhoud van je auto
                                    te delen.</p>
                            </div>
                        </article>

                        <article className="benefit sustainability">
                <span className="benefit__image-wrapper">
                    <img src={img_environmental_sustainability} alt="Footprint in forest"/>
                </span>
                            <div className="benefit__info-container">
                                <h4>Milieuvriendelijk</h4>
                                <p>Draag bij aan een beter milieu en verminder je ecologische voetafdruk.
                                    Carpoolen vermindert het aantal auto's op de weg en zorgt voor minder CO2-uitstoot
                                    en
                                    luchtverontreiniging.</p>
                            </div>
                        </article>

                        <article className="benefit stress-reduction">
                <span className="benefit__image-wrapper">
                    <img src={img_conviviality} alt="People having fun while carpooling"/>
                </span>
                            <div className="benefit__info-container">
                                <h4>Stress verminderend</h4>
                                <p>Maak nieuwe vrienden en verminder de stress van het rijden. Carpoolen biedt een
                                    geweldige kans om in contact te komen met anderen en je rit aangenamer te maken.
                                    Bovendien kan carpoolen bijdragen aan het verminderen van stress en vermoeidheid,
                                    waardoor je ontspannen op je bestemming aankomt.</p>
                            </div>
                        </article>
                    </div>
                </section>

                <section id="how-it-works" className="outer-content-container">
                    <div className="inner-content-container default-area-padding default-text-restrictor">
                        <article className="expl-box">
                            <h6>Zo werkt het</h6>
                            <p>
                                Hallo carpool-liefhebbers! Weet je wat zo geweldig is aan ons platform? Je kunt niet
                                alleen ritten vinden, maar ook ritten plaatsen! Het is super makkelijk: vul je profiel
                                aan en maak een rit aan. kies zelf de prijs, het aantal passagiers dat je wilt meenemen
                                en alle overige ritdetails.
                                Passagiers kunnen dan eenvoudig contact met je opnemen via ons interne berichtensysteem
                                en samen delen jullie de kosten van de reis.
                            </p>
                            <p>
                                Ben je op zoek naar een lift? Zoek dan gemakkelijk naar beschikbare ritten die bij jouw
                                planning passen. En voordat je boekt, kan je altijd even contact opnemen met de
                                bestuurder via ons messaging systeem of telefoon om vragen te stellen en elkaar beter te
                                leren kennen. Het betalen van de ritkosten regelen jullie onderling, dus geen zorgen
                                daarover.
                            </p>
                            <p>
                                Eenmaal op weg, leun achterover en geniet van de reis! En als alles goed gaat, laat dan
                                niet na om je chauffeur een beoordeling te geven - wie weet geven ze er wel een voor jou
                                terug!
                            </p>
                        </article>
                    </div>
                </section>

                <section className="outer-content-container">
                    <div className="inner-content-container">
                        <p>Enthousiast geworden? <Link to="/signup">Registreer</Link> je nu om te beginnen met het delen
                            van
                            ritten, geld te besparen en nieuwe mensen te ontmoeten. Of bekijk onze Veelgestelde Vragen
                            (FAQ)
                            pagina voor meer informatie over ons platform en hoe het werkt.</p>
                        <p>Ben je <Link to="/signin">ingelogd</Link>? Bekijk dan hier je <Link
                            to="/profile">Profielpagina</Link> en start vandaag nog met onbezorgd reizen!</p>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;