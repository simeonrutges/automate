import React, {useContext, useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import Modal from "./../../context/modal/Modal";
import './home.css';
import picture from '../../assets/shutterstock_2122349819.jpg';
import picture_save from '../../assets/money-saving-tips-1622109964.jpg';
import img_environmental_sustainability from '../../assets/sustainability.jpg';
import img_conviviality from '../../assets/conviviality.jpg';
import FormInput from "../../components/formInput/FormInput";
import axios, {defaults} from "axios";
import {AuthContext} from "../../context/AuthContext";


function Home() {
    //aanroepen context:
    const {isAuth, logout, isBestuurder, isPassagier, user} = useContext(AuthContext);
    // const watIsDit = useContext(AuthContext);
    // console.log(watIsDit);


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

    // const [submitDisabled, setSubmitDisabled] = useState(true); // << hier wordt de state-variabele gedefinieerd en standaard ingesteld op true
    // const [fieldsFilled, setFieldsFilled] = useState(false);


    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const history = useHistory();

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


    const padZero = (num) => {
        return num.toString().padStart(2, '0');
    }

    // tot hier proberen...

    const handlePricePerPersonChange = (e) => {
        setPricePerPerson(e.target.value);
    };

    const handleAvailableSpotsChange = (e) => {
        setAvailableSpots(e.target.value);
    };

    const handleEtaChange = (e) => {
        setEta(e.target.value);
    };


    // const handleSubmitSelfDrive = async (e) => {
    async function handleSubmitSelfDrive(e) {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const username = isAuth && user.username ? user.username : '';
            console.log("username: " + username);

            const result = await axios.post('http://localhost:8080/rides', {
                pickUpLocation: pickUpLocation,
                destination: destination,
                route: route,
                addRideInfo: addRideInfo,
                // departureTime: departureTime,
                // departureDate: departureDate,
                departureDateTime: departureDateTime,
                pricePerPerson: pricePerPerson,
                availableSpots: availableSpots,
                eta: eta,

                driverUsername: username

            });
            console.log(result);

            ///// test koppeling
            // Add the current user to the list of users for the ride
            const rideId = result.data.id;
            // const user = isAuth.user;
            const response = await axios.post(
                `http://localhost:8080/rides/${rideId}/${username}`
            );
            // NU DE DELETE AANPASSEN!!!!!
            ////


            // controle browsertijd:
            const dateTime = new Date();
            const dateTimeString = dateTime.toString();
            console.log(`De huidige datum en tijd zijn: ${dateTimeString}.`);

            const id = result.data.id;

            // if everything went well, redirect to the ride-page
            // history.push('/ride/:id');
            history.push(`/ride/${id}`);
        } catch (e) {
            console.error(e);
            toggleError(true);
        }
        toggleLoading(false);
    }

    //RideAlong-form
    const [pax, setPax] = useState('');
    // const { currentUser } = useAuth(); // haal de huidige gebruiker op uit de AuthContext

    const handleSubmitRideAlong = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {

            const result = await axios.get('http://localhost:8080/rides', {
                params: {
                    pickUpLocation: pickUpLocation,
                    destination: destination,
                    pax: pax,
                    departureDate: departureDate,
                }
            });
            console.log(result);

            // if everything went well, redirect to the ride-page
            // history.push('/rides');
            history.push(`/rides?pickUpLocation=${pickUpLocation}&destination=${destination}&pax=${pax}&departureDate=${departureDate}`);
            // history.push(`/rides?pickUpLocation=${pickUpLocation}&destination=${destination}&pax=${pax}&departureDate=${departureDateOnly}`);
        } catch (e) {
            console.error(e.response.data);
            toggleError(true);
        }

        toggleLoading(false);
    }

    // const handleSelfDriveClick = () => {
    //     if (!isAuth) {
    //         history.push('/signin');
    //         return;
    //     }
    //     setActiveForm('selfDrive');
    // }

    // const handleSelfDriveClick = () => {
    //     console.log(isAuth);
    //     console.log(isAuth.user)
    //     if (!isAuth) {
    //         history.push('/signin');
    //         return;
    //     }
    //     if (isPassagier) {
    //         alert("Je moet een BESTUURDER zijn om dit te kunnen doen.");
    //         return;
    //     }
    //     setActiveForm('selfDrive');
    // }

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

    // const handleFieldsChange = () => {
    //     if (activeForm === 'selfDrive') {
    //         if (pickUpLocation && destination && departureTime && departureDate && pricePerPerson && availableSpots) {
    //             setFieldsFilled(true);
    //         } else {
    //             setFieldsFilled(false);
    //         }
    //     }
    //     else {
    //         if (pickUpLocation && departureDate && pax ) {
    //             setFieldsFilled(true);
    //         } else {
    //             setFieldsFilled(false);
    //         }
    //     }
    // };

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
                        {/*{isAuth ?*/}
                        <div className="form-buttonblock-home">
                            <button className="form-button-home ${activeForm === 'selfDrive' ? 'active' : ''}"
                                // type="button" onClick={() => setActiveForm('selfDrive')}disabled={!isAuth}>Zelf rijden

                                    type="button" onClick={handleSelfDriveClick}>Zelf rijden

                            </button>

                            <button className="form-button-home ${activeForm === 'rideAlong' ? 'active' : ''}"
                                    type="button" onClick={() => setActiveForm('rideAlong')}>Rij mee
                            </button>
                        </div>

                        {activeForm === 'selfDrive' ? (
                                <form onSubmit={handleSubmitSelfDrive}>
                                    <FormInput id="pickUpLocation" labelText="Vertrek locatie:" inputType="text"
                                               value={pickUpLocation} onChange={handlePickUpLocationChange}/>
                                    <FormInput id="destination" labelText="Bestemming:" inputType="text" value={destination}
                                               onChange={handleDestinationChange}/>
                                    <FormInput id="route" labelText="Route:" inputType="text" value={route}
                                               onChange={handleRouteChange}/>
                                    <FormInput id="addRideInfo" labelText="Extra ritinformatie:" inputType="text"
                                               value={addRideInfo} onChange={handleAddRideInfoChange}/>


                                    <FormInput id="departureTime" labelText="Vertrektijd:" inputType="time"
                                               value={departureTime} onChange={handleDepartureTimeChange}/>
                                    <FormInput id="departureDate" labelText="Vertrekdatum:" inputType="date"
                                               value={departureDate} onChange={handleDepartureDateChange}/>

                                    {/*<FormInput id="pricePerPerson" labelText="Prijs per persoon:" inputType="number" value={pricePerPerson} onChange={handlePricePerPersonChange} />*/}
                                    <FormInput id="pricePerPerson" labelText="Prijs per persoon:" inputType="number" min="1"
                                               step="0.01" value={pricePerPerson} onChange={handlePricePerPersonChange}/>
                                    {/*<FormInput id="availableSpots" labelText="Beschikbare plaatsen:" inputType="number" value={availableSpots} onChange={handleAvailableSpotsChange} />*/}
                                    <FormInput id="availableSpots" labelText="Beschikbare plaatsen:" inputType="number"
                                               min="1" max="5" step="1" value={availableSpots}
                                               onChange={handleAvailableSpotsChange}/>
                                    <FormInput id="eta" labelText="Geschatte aankomsttijd:" inputType="time" value={eta}
                                               onChange={handleEtaChange}/>


                                    <button type="submit">Plaats rit</button>
                                </form>
                            )
                            : (

                                <form onSubmit={handleSubmitRideAlong}>
                                    <FormInput id="pickUpLocation" labelText="Vertrek locatie:" inputType="text"
                                               value={pickUpLocation}
                                               onChange={e => setPickUpLocation(e.target.value)}/>

                                    <FormInput id="destination" labelText="Bestemming:" inputType="text"
                                               value={destination} onChange={e => setDestination(e.target.value)}/>

                                    <FormInput id="pax" labelText="Aantal reizigers:" inputType="number" value={pax}
                                               onChange={e => setPax(e.target.value)}/>

                                    <FormInput id="departureDate" labelText="Reisdatum:" inputType="date"
                                               value={departureDate} onChange={e => setDepartureDate(e.target.value)}/>


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
                                    Carpoolen vermindert het aantal auto's op de weg en zorgt voor minder CO2-uitstoot en
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


                {/*<section>*/}
                {/*    <p>Kostenbesparing: Bespaar geld en deel je rit met anderen. Carpoolen is de perfecte manier om je*/}
                {/*        uitgaven voor brandstof te verminderen en de kosten voor het onderhoud van je auto te delen. Als*/}
                {/*        passagier kun je genieten van een betaalbare en comfortabele manier om te reizen, zonder je*/}
                {/*        zorgen te maken over de kosten van een eigen auto. Door samen te rijden helpen we elkaar om geld*/}
                {/*        te besparen en duurzamer te reizen!</p>*/}
                {/*    <p>Milieuvriendelijkheid: Draag bij aan een beter milieu en verminder je ecologische voetafdruk.*/}
                {/*        Carpoolen vermindert het aantal auto's op de weg en zorgt voor minder CO2-uitstoot en*/}
                {/*        luchtverontreiniging.</p>*/}

                {/*    <p>Gezelligheid: Maak nieuwe vrienden en verminder de stress van het rijden. Carpoolen biedt een*/}
                {/*        geweldige kans om in contact te komen met anderen en je rit aangenamer te maken. Bovendien kan*/}
                {/*        carpoolen bijdragen aan het verminderen van stress en vermoeidheid, waardoor je ontspannen op je*/}
                {/*        bestemming aankomt.</p>*/}
                {/*</section>*/}

                <section id="intro" className="outer-content-container">
                    <div className="inner-content-container default-area-padding default-text-restrictor">
                        <div className="expl-box">
                        <h6>Zo werkt het</h6>
                        <p>
                            Hallo carpool-liefhebbers! Weet je wat zo geweldig is aan ons platform? Je kunt niet alleen ritten vinden, maar ook ritten plaatsen! Het is super makkelijk: vul je profiel aan met je ritdetails, kies zelf de prijs en het aantal passagiers dat je wilt meenemen. Passagiers kunnen dan eenvoudig contact met je opnemen via ons interne berichtensysteem of telefonisch, en samen delen jullie de kosten van de reis.
                        </p>
                        <p>
                            Ben je op zoek naar een lift? Zoek dan gemakkelijk naar beschikbare ritten die bij jouw planning passen. En voordat je boekt, kan je altijd even contact opnemen met de bestuurder via ons messaging systeem of telefoon om vragen te stellen en elkaar beter te leren kennen. Het betalen van de ritkosten regelen jullie onderling, dus geen zorgen daarover.
                        </p>
                        <p>
                            Eenmaal op weg, leun achterover en geniet van de reis! En als alles goed gaat, laat dan niet na om je chauffeur een beoordeling te geven - wie weet geven ze er wel een voor jou terug!
                        </p>
                        </div>
                    </div>
                </section>


                <section id="how-it-works" className="uitleg-box">
                    <div className="tekst-box">
                        <h3>Zo werkt het</h3>
                        <p>Hey, carpool-liefhebbers! Wist je dat je niet alleen ritten kunt vinden, maar ook ritten kunt
                            plaatsen op ons platform? Het enige wat je hoeft te doen is je profiel aanvullen en je
                            ritdetails invoeren. Je kunt zelf kiezen welke prijs je wilt vragen voor je rit en hoeveel
                            passagiers je wilt meenemen.
                            Passagiers kunnen dan eenvoudig contact met je opnemen via ons interne berichtensysteem of
                            door te bellen. Samen delen jullie dan de kosten van de reis.</p>
                        <p>Als je juist een passagier bent die een lift nodig heeft, zoek dan gemakkelijk naar
                            beschikbare ritten die bij jouw planning passen. Voordat je boekt, kan je altijd contact
                            opnemen met de bestuurder via ons messaging systeem of via je telefoon om eventuele vragen
                            te stellen en om ze beter te leren kennen.
                            Het betalen van de ritkosten regelen jullie onderling.
                        </p>
                        <p>Als je eenmaal op weg bent, kan je ontspannen en genieten van de reis. En als alles goed
                            gaat, vergeet dan niet om je chauffeur een beoordeling te geven - wie weet geven ze er wel
                            een voor jou terug!</p>
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