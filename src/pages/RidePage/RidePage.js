import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import  './ridePage.css';

function RidePage() {
    const [rideData, setRideData] = useState({});
    const {user} = useContext(AuthContext);

    const {id} = useParams();
    //useParams geeft alleen welke sok het is

// GET request om sok 34 (id) op te vragen naar BE
    useEffect(() => {
        async function fetchRideData() {
            try {
                const response = await axios.get(`http://localhost:8080/rides/${id}`);
                setRideData(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchRideData()
    }, [id]);

    // Delete ride request
    const history = useHistory();

    async function handleAnnuleerRitClick() {
        try {
            await axios.delete(`http://localhost:8080/rides/${id}`);
            history.push('/');
        } catch (error) {
            console.error(error);
        }
    }




    return (
        <ride className="outer-content-container">
            <div className="inner-content-container">

                <div className="product-page">
                    <h1>Reis details {id}</h1>


                    {Object.keys(rideData).length > 0 &&
                        <div>
                            <p>reisdatum: {new Date(rideData.departureDateTime).toLocaleDateString()}</p>
                        <section className="ride-summary">
                            <div className="top-box">
                            <span className="summary-block1">
                                <p>{new Date(rideData.departureDateTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}</p>
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
                                {/*<p>{rideData.automaticAcceptance}</p>*/}
                            </section>
                        </div>
                    }


                    <div className="buttons">
                        {/*<button id="wijzig-rit-btn">Wijzig rit</button>*/}
                        <button onClick={handleAnnuleerRitClick} id="annuleer-rit-btn">Annuleer rit</button>
                    </div>

                    <p className="home-page-link">Terug naar de <Link to="/">Homepagina</Link></p>

                </div>

            </div>
        </ride>


    )
}


export default RidePage;