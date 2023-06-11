// import React, {useContext, useEffect, useState} from "react";
// import {Link, useHistory, useParams} from "react-router-dom";
// import {AuthContext} from "../../context/AuthContext";
// import axios from "axios";
// import  './ridePage.css';
//
// function RidePage() {
//     const [rideData, setRideData] = useState({});
//     const {user} = useContext(AuthContext);
//     const [currentData, setCurrentData] = useState("");
//
//     const {id} = useParams();
//     //useParams geeft alleen welke rit het is
//     const { rideId } = useParams();
// //
// //     const [bestuurderUsername, setBestuurderUsername] = useState(null);
// //
//     let datum = [];
// // GET request
//     useEffect(() => {
//         async function fetchRideData() {
//             try {
//                 const response = await axios.get(`http://localhost:8080/rides/${id}`);
//                 setRideData(response.data);
//                 datum = response.data.departureDateTime.split("T");
//                 setCurrentData(datum[1])
//                 console.log(response.data)
//
//                 // Haal de bestuurdersnaam op en sla deze op in de staat
//                 // const bestuurder = await fetchBestuurder();
//                 // setBestuurderUsername(bestuurder);
//                 // console.log("bestuurder: " + bestuurder);
//                 ////
//
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//
//         fetchRideData()
//     }, [id]);
//
//     // DELETE ride request
//     const history = useHistory();
//     async function handleAnnuleerRitClick() {
//         try {
//             await axios.delete(`http://localhost:8080/rides/${id}`);
//             history.push('/');
//         } catch (error) {
//             console.error(error);
//         }
//     }
//
//     //////// hierboven soweiso goed
//     // async function handleAnnuleerRitClick() {
//     //     try {
//     //         await axios.delete(`http://localhost:8080/rides/${id}`, {
//     //             headers: {
//     //                 "Content-Type": "application/json",
//     //                 Authorization: `Bearer ${token}`,
//     //             },});
//     //         history.push('/');
//     //     } catch (error) {
//     //         console.error(error);
//     //     }
//     // }
//
// /////////////
//     ///// nog implementeren:
//     // async function handleDeleteUser() {
//     //     try {
//     //         // Verwijder eerst alle rides die zijn gekoppeld aan de gebruiker
//     //         await axios.delete(`http://localhost:8080/users/${username}/rides`);
//     //
//     //         // Vervolgens verwijder je de gebruiker zelf
//     //         await axios.delete(`http://localhost:8080/users/${username}`);
//     //
//     //         // Navigeer terug naar de startpagina of een andere pagina
//     //         history.push('/');
//     //     } catch (error) {
//     //         console.error(error);
//     //     }
//     // }
//     //////
//
//     // async function fetchBestuurder() {
//     //     try {
//     //         const result = await axios.get(`http://localhost:8080/users`, {
//     //             headers: {
//     //                 "Content-Type": "application/json",
//     //             },
//     //         });
//     //         console.log(result.data.username);
//     //         return result.data.username;
//     //     } catch (e) {
//     //         console.error(e);
//     //         return null;
//     //     }
//     // }
//
//
//     return (
//         <ride className="outer-content-container">
//             <div className="inner-content-container">
//
//                 <div className="product-page">
//                     <h1>Reis details {id}</h1>
//
//
//                     {Object.keys(rideData).length > 0 &&
//                         <div>
//                             {console.log(rideData)}
//                             <p>reisdatum: {new Date(rideData.departureDateTime).toLocaleDateString()}</p>
//                         <section className="ride-summary">
//                             <div className="top-box">
//                             <span className="summary-block1">
//                                 <p>
//                                     { currentData }
//                                 </p>
//                                 <p>{rideData.pickUpLocation}</p>
//
//                                 <p>{rideData.eta}*</p>
//                                 {/*<p>{rideData.eta.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>*/}
//
//                                 <p>{rideData.destination}</p>
//                             </span>
//                             <span className="summary-block2">
//                                 <p className="ride-page-price">Prijs per
//                                     persoon: {(rideData.pricePerPerson).toLocaleString('nl-NL', {
//                                         style: 'currency',
//                                         currency: 'EUR'
//                                     })}</p>
//                                 <p>Aantal personen: {rideData.pax}</p>
//                                 <p>Totaal prijs: {rideData.totalRitPrice}</p>
//                             </span>
//                             </div>
//
//                             {/*{bestuurderUsername && (*/}
//                             {/*    <p>De gebruikersnaam van de bestuurder is: {bestuurderUsername}</p>*/}
//                             {/*)}*/}
//
//                             <p>* Verwachte aankomst tijd</p>
//
//
//
//                         </section>
//                             <section className="ride-info">
//                                 <p>Ophaal locatie: {rideData.pickUpLocation}</p>
//                                 <p>{new Date(rideData.departureDateTime).toLocaleTimeString([], {
//                                     hour: '2-digit',
//                                     minute: '2-digit',
//                                     hour12: false
//                                 })}</p>
//                                 <p>Bestemming: {rideData.destination}</p>
//                                 <p>{rideData.eta}*</p>
//                                 <p>Aantal beschikbare plekken:{rideData.availableSpots}</p>
//                                 <p>Route: {rideData.route}</p>
//                                 <p>Reis omschrijving: {rideData.addRideInfo}</p>
//                                 {/*<p>{rideData.automaticAcceptance}</p>*/}
//                             </section>
//                         </div>
//                     }
//
//
//                     <div className="buttons">
//                         {/*<button id="wijzig-rit-btn">Wijzig rit</button>*/}
//                         <button onClick={handleAnnuleerRitClick} id="annuleer-rit-btn">Annuleer rit</button>
//                     </div>
//
//                     <p className="home-page-link">Terug naar de <Link to="/">Homepagina</Link></p>
//
//                 </div>
//
//             </div>
//         </ride>
//
//
//     )
// }
//
//
// export default RidePage;