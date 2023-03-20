import React, {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Modal from "./../../context/modal/Modal";
import  './home.css';
import picture from '../../assets/shutterstock_2122349819.jpg'
import FormInput from "../../components/formInput/FormInput";
import axios, {defaults} from "axios";
import {AuthContext} from "../../context/AuthContext";


function Home() {
    //aanroepen context:
    const {isAuth, logout} = useContext(AuthContext);
    // const history = useHistory();

    //voor het zoek-form
    const [pax, setPax] = useState('');
    // const { currentUser } = useAuth(); // haal de huidige gebruiker op uit de AuthContext

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const result = await axios.get('http://localhost:8080/rides', {});
            console.log(result);

            // if everything went well, redirect to the ride-page
            history.push('/rides');
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }
    // voor het switchen van de forms
    const [activeForm, setActiveForm] = useState('rideAlong'); // 'rideAlong' of 'selfDrive'


    // voor addRide form
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [route, setRoute] = useState('');
    const [addRideInfo, setAddRideInfo] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [departureDate, setDepartureDate] = useState('');

    // test voor LcalDate
    const departureDateTime = new Date(`${departureDate}T${departureTime}`);
    // const [date, setDate] = useState('');
    // const [time, setTime] = useState('');

    // tot hier test

    const [pricePerPerson, setPricePerPerson] = useState('');
    const [availableSpots, setAvailableSpots] = useState('');
    const [eta, setEta] = useState('');

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
// hierio
//     const handleDateValueChange = (e) => {
//         setDate(e.target.value);
//     };
//
//     const handleTimeValueChange = (e) => {
//         setTime(e.target.value);
//     };

    // tot hier

    const handleDepartureDateChange = (e) => {
        setDepartureDate(e.target.value);
    };

    const handlePricePerPersonChange = (e) => {
        setPricePerPerson(e.target.value);
    };

    const handleAvailableSpotsChange = (e) => {
        setAvailableSpots(e.target.value);
    };

    const handleEtaChange = (e) => {
        setEta(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            const result = await axios.post('http://localhost:8080/rides', {
                pickUpLocation: pickUpLocation,
                destination: destination,
                route: route,
                addRideInfo: addRideInfo,
                departureTime: departureTime,

                // timeValue: time,
                // dateValue: date,

                departureDate: departureDate,
                pricePerPerson: pricePerPerson,
                availableSpots: availableSpots,
                eta: eta,
            });
            console.log(result);

            // if everything went well, redirect to the ride-page
            history.push('/ride/:id');
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }

    return (
        <home className="outer-content-container">
            <div className="inner-content-container">

                {/*Waarom heeft de margin 50px? -> App.css */}
                <section className="home-page">
                    <img src={picture} alt="beschrijving van de afbeelding"/>
                    <div className="textvlak">
                        <h1>De slimme keuze voor milieubewuste reizigers</h1>
                    </div>


                    <div className="blok">
                        {/*{isAuth ?*/}
                        <div className="form-buttonblock-home">
                            <button className="form-button-home ${activeForm === 'selfDrive' ? 'active' : ''}"
                                    type="button" onClick={() => setActiveForm('selfDrive')}>Zelf rijden
                            </button>
                            <button className="form-button-home ${activeForm === 'rideAlong' ? 'active' : ''}"
                                    type="button" onClick={() => setActiveForm('rideAlong')}>Rij mee
                            </button>
                        </div>

                        {activeForm === 'selfDrive' ? (
                                <form onSubmit={handleSubmit}>
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

                                    {/*<FormInput id="date" labelText="Datum:" inputType="date" value={date} onChange={handleDateValueChange} />*/}
                                    {/*<FormInput id="time" labelText="Tijd:" inputType="time" value={time} onChange={handleTimeValueChange} />*/}


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

                                <form onSubmit={handleSubmit2}>
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

                <section>
                    <p>Als je ingelogd bent, bekijk dan de <Link to="/profile">Profielpagina</Link></p>
                    <p>Je kunt ook <Link to="/signin">inloggen</Link> of jezelf <Link to="/signup">registeren</Link> als
                        je nog geen
                        account hebt.</p>
                </section>

            </div>
        </home>
    );
}


export default Home;