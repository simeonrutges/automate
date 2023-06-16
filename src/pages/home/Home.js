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

    // voor het switchen van de forms
    const [activeForm, setActiveForm] = useState('rideAlong'); // 'rideAlong' of 'selfDrive'

    // voor addRide form
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

    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const [dateTimeError, setDateTimeError] = useState(null);
    const [etaError, setEtaError] = useState("");
    const [departureDateError, setDepartureDateError] = useState("");

    const history = useHistory();

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

    const setDepartureDateTime = (dateTimeString) => {
        // Parse the datetime string into a Date object
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

        // Maak een nieuw Date object voor de huidige tijd
        const now = new Date();
        // Maak een nieuw Date object voor de ingevoerde tijd
        const enteredDateTime = new Date(departureDateTime);

        // Controleer of de ingevoerde tijd in de toekomst ligt
        if (enteredDateTime <= now) {
            // Update de error message als de tijd niet in de toekomst ligt
            setDateTimeError("De gekozen vertrektijd ligt in het verleden. Selecteer een vertrektijd in de toekomst.");
            return;
        } else {
            setDateTimeError("");
        }

         // ETA error. Haal de uren en minuten uit de eta
        const [etaHours, etaMinutes] = eta.split(':').map(Number);
        const enteredHours = enteredDateTime.getHours();
        const enteredMinutes = enteredDateTime.getMinutes();
// Controleer of de ETA na de vertrektijd ligt
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
                driverUsername: username
            }, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log("POST-ride:  ", result);

            // Add the current user to the list of users for the ride
            const rideId = result.data.id;
            console.log(rideId, username, token);
            // const response = await axios.post(`http://localhost:8080/rides/${rideId}/${username}/${0}`);
            const response = await axios.post(`http://localhost:8080/rides/${rideId}/${username}/${0}`, {}, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            // klopt: pax = 0 bij bestuurder
            console.log("response: ",response);

            const id = result.data.id;

            history.push(`/ride/${id}`);
        } catch (e) {
            console.error(e);
            if (e.response && e.response.data) {
                console.error('Server response:', e.response.data);
                // Hier kan je ook de server response tonen in de gebruikersinterface, als je wilt
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
        // Maak een nieuw Date object voor de huidige tijd (zonder tijdstempel)
        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);  // Zet de tijd op 00:00:00

        // Maak een nieuw Date object voor de gekozen reisdatum
        const chosenDate = new Date(departureDate);

        // Controleer of de gekozen reisdatum in het verleden ligt
        if (chosenDate < nowDate) {
            setDepartureDateError("De gekozen reisdatum ligt in het verleden. Selecteer een reisdatum die vandaag of in de toekomst ligt.");
            return;
        } else {
            setDepartureDateError("");
        }

        try {
            console.log("token : ", token);

            const result = await axios.get('http://localhost:8080/rides', {
                params: {
                    pickUpLocation: pickUpLocation,
                    destination: destination,
                    pax: pax,
                    departureDate: departureDate,
                },
            headers: {"Content-Type": 'application/json',
                // 'Authorization': `Bearer ${token}`,
            }
            });

            console.log("ride GET result.data : ", result.data);

            history.push(`/rides?pickUpLocation=${pickUpLocation}&destination=${destination}&pax=${pax}&departureDate=${departureDate}`);

        } catch (e) {
            console.error(e.response.data);
            toggleError(true);
        }

        toggleLoading(false);
    }


    const handleSelfDriveClick = () => {
        console.log(isAuth);
        console.log(isAuth.user)
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
        <home className="outer-content-container">

            <div className="inner-content-container">

                {/*Waarom heeft de margin 50px? -> App.css */}
                <section className="home-page">
                    <img src={picture} alt="auto door bos" className="cover-img"/>
                    <div className="header-text">
                        <h1>De slimme keuze voor milieubewuste reizigers</h1>
                    </div>


                    <div className="form-container">
                        <div className="form-buttonblock-home">
                            <button className={`form-button-home ${activeForm === 'selfDrive' ? 'active' : ''}`}
                                    type="button" onClick={handleSelfDriveClick}>Zelf rijden
                            </button>
                            <button className={`form-button-home ${activeForm === 'rideAlong' ? 'active' : ''}`}
                                    type="button" onClick={() => setActiveForm('rideAlong')}>Rij mee
                            </button>
                        </div>

                        {activeForm === 'selfDrive' ? (
                                <form onSubmit={handleSubmitSelfDrive}>
                                    <FormInput id="pickUpLocation" labelText="Vertrek locatie:" inputType="text"
                                               value={pickUpLocation} onChange={handlePickUpLocationChange} required/>
                                    <FormInput id="destination" labelText="Bestemming:" inputType="text" value={destination}
                                               onChange={handleDestinationChange} required/>
                                    <FormInput id="route" labelText="Route:" inputType="text" value={route}
                                               onChange={handleRouteChange}/>
                                    <FormInput id="addRideInfo" labelText="Extra ritinformatie:" inputType="text"
                                               value={addRideInfo} onChange={handleAddRideInfoChange}/>
                                    <FormInput id="departureTime" labelText="Vertrektijd:" inputType="time"
                                               value={departureTime} onChange={handleDepartureTimeChange} required/>
                                    <FormInput id="departureDate" labelText="Vertrekdatum:" inputType="date"
                                               value={departureDate} onChange={handleDepartureDateChange} required/>
                                    {dateTimeError && <div className="error">{dateTimeError}</div>}

                                    <FormInput id="pricePerPerson" labelText="Prijs per persoon:" inputType="number" min="3"
                                               step="0.01" value={pricePerPerson} onChange={handlePricePerPersonChange}
                                               required/>
                                    {pricePerPersonError && <div className="error">{pricePerPersonError}</div>}

                                    <FormInput id="availableSpots" labelText="Beschikbare plaatsen:" inputType="number"
                                               min="1" max="5" step="1" value={availableSpots}
                                               onChange={handleAvailableSpotsChange} required/>
                                    {availableSpotsError && <div className="error">{availableSpotsError}</div>}
                                    <FormInput id="eta" labelText="Geschatte aankomsttijd:" inputType="time" value={eta}
                                               onChange={handleEtaChange} required/>
                                    {etaError && <div className="error">{etaError}</div>}

                                    <button type="submit">Plaats rit</button>
                                </form>
                            )
                            : (
                                <form onSubmit={handleSubmitRideAlong}>
                                    <FormInput id="pickUpLocation" labelText="Vertrek locatie:" inputType="text"
                                               value={pickUpLocation}
                                               onChange={e => setPickUpLocation(e.target.value)} required/>

                                    <FormInput id="destination" labelText="Bestemming:" inputType="text"
                                               value={destination} onChange={e => setDestination(e.target.value)}
                                               required/>

                                    <FormInput id="pax" labelText="Aantal reizigers:" inputType="number" min="1" max="5"
                                               step="1" value={pax}
                                               onChange={e => setPax(e.target.value)} required/>
                                    {pax < 1 || pax > 5 &&
                                        <div className="error">Het aantal reizigers moet tussen 1 en 5 liggen.</div>}

                                    <FormInput id="departureDate" labelText="Reisdatum:" inputType="date"
                                               value={departureDate} onChange={e => setDepartureDate(e.target.value)} required/>
                                    {departureDateError && <div className="error">{departureDateError}</div>}

                                    <button type="submit">Zoeken</button>
                                </form>
                            )}

                    </div>


                </section>
                <section id="pros" className="outer-content-container">
                    <div className="inner-content-container default-area-padding">

                        <article className="work-article">
                <span className="work-article__image-wrapper">
                     <img src={picture_save} alt="Portfolio work"/>
                </span>

                            <div className="work-article__info-container">
                                <h4>Kostenbesparend</h4>
                                <div className="work-article__title-squiggle"></div>
                                <p>Bespaar geld en deel je rit met anderen. Carpoolen is de perfecte manier om je
                                    uitgaven voor brandstof te verminderen en de kosten voor het onderhoud van je auto
                                    te delen.</p>
                            </div>
                        </article>
                        <article className="work-article">
                <span className="work-article__image-wrapper">
                    <img src={img_environmental_sustainability} alt="Portfolio work"/>
                </span>

                            <div className="work-article__info-container">
                                <h4>Milieuvriendelijk</h4>
                                <div className="work-article__title-squiggle"></div>
                                <p>Draag bij aan een beter milieu en verminder je ecologische voetafdruk.
                                    Carpoolen vermindert het aantal auto's op de weg en zorgt voor minder CO2-uitstoot
                                    en
                                    luchtverontreiniging.</p>
                            </div>
                        </article>
                        <article className="work-article">
                <span className="work-article__image-wrapper">
                    <img src={img_conviviality} alt="Portfolio work"/>
                </span>

                            <div className="work-article__info-container">
                                <h4>Stress verminderend</h4>
                                <div className="work-article__title-squiggle"></div>
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
                        <div className="expl-box">
                            <h6>Zo werkt het</h6>
                            <p>
                                Hallo carpool-liefhebbers! Weet je wat zo geweldig is aan ons platform? Je kunt niet
                                alleen ritten vinden, maar ook ritten plaatsen! Het is super makkelijk: vul je profiel
                                aan met je ritdetails, kies zelf de prijs en het aantal passagiers dat je wilt meenemen.
                                Passagiers kunnen dan eenvoudig contact met je opnemen via ons interne berichtensysteem
                                of telefonisch, en samen delen jullie de kosten van de reis.
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
                        </div>
                    </div>
                </section>

                <section>
                    <p>Enthousiast geworden? <Link to="/signup">Registreer</Link> je nu om te beginnen met het delen van
                        ritten, geld te besparen en nieuwe mensen te ontmoeten. Of bekijk onze Veelgestelde Vragen (FAQ)
                        pagina voor meer informatie over ons platform en hoe het werkt.</p>
                    <p>Ben je <Link to="/signin">ingelogd</Link>? Bekijk dan hier je <Link
                        to="/profile">Profielpagina</Link> en start vandaag nog met onbezorgd reizen!</p>
                </section>

            </div>
        </home>
    );
}

export default Home;