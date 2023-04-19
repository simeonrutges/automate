import React, {useEffect, useState} from "react";
import  './rideOverViewPage.css';
import {useParams} from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";

// // const ridesDatabase = [
// //     'sneller rit',
// //     'langzame rit',
// //     'supersonische rit',
// // ];
// const ridesDatabase = [
//     {
//         pickUpLocation: 'Amsterdam Centraal',
//         destination: 'Keukenhof',
//         departureTime: '10:00',
//         pricePerPerson: 20,
//         totalRitPrice: 80,
//         pax: 4,
//         eta: '11:30'
//     },
//     {
//         pickUpLocation: 'Schiphol Airport',
//         destination: 'Zaanse Schans',
//         departureTime: '13:00',
//         pricePerPerson: 15,
//         totalRitPrice: 60,
//         pax: 2,
//         eta: '14:00'
//     },
//     {
//         pickUpLocation: 'Rotterdam Centraal',
//         destination: 'Kinderdijk',
//         departureTime: '15:00',
//         pricePerPerson: 10,
//         totalRitPrice: 32,
//         pax: 4,
//         eta: '17:15'
//     }
// ];
//
//
//
// // dit alles kan dus ook met objecten!
// // function RidesOverview(){
// //     return (
// //         <div className="rides-overview-page">
// //             <h1>Alle gevonden ritten</h1>
// //             <ul>
// //                 {ridesDatabase.map((rideName)=>{
// //                     return <li key={rideName}>{rideName}</li> //ridename moet in mijn geval iets van ID zijn! iets unieks!
// //
// //                     // return <li key={rideId}><span><a href=".."></a> </span>{ride}</li>  : key op buitenste element!
// //                 })}
// //             </ul>
// //         </div>
// //     );
// // }

function RidesOverview({ location }) {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pickUpLocation = searchParams.get('pickUpLocation');
        const destination = searchParams.get('destination');
        // const pax = searchParams.get('pax');
        const departureDate = searchParams.get('departureDate');


        async function fetchRides() {
            console.log(departureDate)
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/rides', {
                    params: {
                        pickUpLocation,
                        destination,
                        // pax,
                        departureDate,
                    },
                });
                console.log('Response:', response);
                //sams: ...
                // const output = response.data[0].departureDateTime.split("T")
                // console.log(output)
                // if (output[0] === departureDate) {
                //     setRides(response.data)
                // }

                // const departureDateMatches = response.data.some(ride => ride.departureDateTime.split("T")[0] === departureDate);
                // if (departureDateMatches) {
                //     setRides(response.data);

                // zelf..:
                const matchingRides = response.data.filter(ride => ride.departureDateTime.split("T")[0] === departureDate);
                if (matchingRides.length > 0) {
                    setRides(matchingRides);
                }

                else {
                    console.log("Geen rit")
                }
                // setRides(response.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchRides();
    }, [location.search]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error fetching rides.</p>;
    }






    return (
        <rides className="outer-content-container">
            <div className="inner-content-container">

        <div className="rides-overview-page">


            {rides.length === 0 && (
                <p>Er zijn op deze dag helaas nog geen ritten geplaatst naar jou bestemming. Probeer het op een later tijdstip opnieuw.</p>
            )}
            {rides.length > 0 && (

            <div className="rides-container">
                <h1>Kies een rit</h1>
                {rides.map((ride) => {
                    return (
                        <Link to={`/rides/${ride.id}`} key={ride.id} className="ride-item">
                            <h2>{ride.pickUpLocation} - {ride.destination}</h2>
                            <p>Datum:{new Date(ride.departureDateTime).toLocaleDateString()}</p>
                            <p>Vertrek tijd: {new Date(ride.departureDateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false})}</p>
                            <p>Aankomst tijd: {ride.eta}</p>
                            <p>Prijs per persoon: {ride.pricePerPerson} euro</p>
                            <p>Totaal prijs: {ride.totalRitPrice} euro</p>
                            <p>Aantal personen: {ride.pax}</p>
                            {/*<p>Bestuurder: {ride.}</p>*/}
                        </Link>
                    );
                })}
            </div>
            )}
        </div>

            </div>
        </rides>
    );
}


export  default RidesOverview;