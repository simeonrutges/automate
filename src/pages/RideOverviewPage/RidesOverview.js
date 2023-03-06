import React from "react";
import  './rideOverViewPage.css';
import {useParams} from "react-router-dom";
import { Link } from 'react-router-dom';

// const ridesDatabase = [
//     'sneller rit',
//     'langzame rit',
//     'supersonische rit',
// ];
const ridesDatabase = [
    {
        pickUpLocation: 'Amsterdam Centraal',
        destination: 'Keukenhof',
        departureTime: '10:00',
        pricePerPerson: 20,
        totalRitPrice: 80,
        pax: 4,
        eta: '11:30'
    },
    {
        pickUpLocation: 'Schiphol Airport',
        destination: 'Zaanse Schans',
        departureTime: '13:00',
        pricePerPerson: 15,
        totalRitPrice: 60,
        pax: 2,
        eta: '14:00'
    },
    {
        pickUpLocation: 'Rotterdam Centraal',
        destination: 'Kinderdijk',
        departureTime: '15:00',
        pricePerPerson: 10,
        totalRitPrice: 32,
        pax: 4,
        eta: '17:15'
    }
];



// dit alles kan dus ook met objecten!
// function RidesOverview(){
//     return (
//         <div className="rides-overview-page">
//             <h1>Alle gevonden ritten</h1>
//             <ul>
//                 {ridesDatabase.map((rideName)=>{
//                     return <li key={rideName}>{rideName}</li> //ridename moet in mijn geval iets van ID zijn! iets unieks!
//
//                     // return <li key={rideId}><span><a href=".."></a> </span>{ride}</li>  : key op buitenste element!
//                 })}
//             </ul>
//         </div>
//     );
// }

function RidesOverview() {
    return (
        <div className="rides-overview-page">
            <h1>Kies een rit</h1>
            <div className="rides-container">
                {ridesDatabase.map((ride) => {
                    return (
                        <Link to={`/rides/${ride.id}`} key={ride.id} className="ride-item">
                            <h2>{ride.pickUpLocation} - {ride.destination}</h2>
                            <p>Vertrek: {ride.departureTime} - Aankomst: {ride.eta}</p>
                            <p>Prijs per persoon: {ride.pricePerPerson} euro</p>
                            <p>Totaal prijs: {ride.totalRitPrice} euro</p>
                            <p>Aantal personen: {ride.pax}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}


export  default RidesOverview;