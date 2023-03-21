import React, {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";

function RidePage(){
    const [rideData, setRideData] = useState({});
    const { user } = useContext(AuthContext);

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
    },[id]);


        return (
            <ride className="outer-content-container">
                <div className="inner-content-container">

                    <div className="product-page">
                        <h1>Reis details {id}</h1>


                        {Object.keys(rideData).length > 0 &&
                            <section>
                                <div>
                                <p>reisdatum: {new Date(rideData.departureDateTime).toLocaleDateString()}</p>
                                <p>{new Date(rideData.departureDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12:false})}</p>
                                <p>{rideData.pickUpLocation}</p>
                                <p>{rideData.eta}*</p>
                                <p>{rideData.destination}</p>
                                </div>
                                <div>
                                <p className="ride-page-price">Prijs per persoon: {(rideData.pricePerPerson).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })}</p>
                                <p>Aantal personen: {rideData.availableSpots}</p>
                                <p>Totaal prijs: {rideData.totalRitPrice}</p>
                                </div>
                                <p>* Verwachte aankomst tijd</p>
                            </section>

                            // kan in een keer alles doorgeven:
                            // Object.entries(rideData).map(([key, value]) => {
                            //     // id hierdoor weggelaten!
                            //     if (key !== "id") {
                            //         return (
                            //             <div key={key}>
                            //                 <h6>{key}: {value}</h6>
                            //             </div>
                            //         );
                            //     }
                            //     return null;
                            // })


                        }

                    </div>
                    <p>Terug naar de <Link to="/">Homepagina</Link></p>
                </div>
            </ride>


        )
    }


export  default RidePage;