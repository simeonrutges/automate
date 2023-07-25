import React from "react";
import {Link, useParams} from "react-router-dom";
import './confirmation.css';

function Confirmation({action}){
    const {type, success} = useParams();

    const messages = {
        success: {
            reservation: 'Uw reservering is gemaakt!',
            rideAdded: 'De rit is succesvol toegevoegd',
            rideRemoved: 'De rit is succesvol verwijderd. Eventuele passagiers zijn hiervan op de hoogte gesteld',
            reservationRemoved: 'Je deelname aan deze rit is succesvol verwijderd. De bestuurder is hiervan op de hoogte gesteld',
        },
        failure: {
            reservation: 'Er is iets misgegaan bij het maken van uw reservering. Probeer het later opnieuw.',
            rideAdded: 'Er is iets misgegaan bij het toevoegen van de rit. Probeer het later opnieuw.',
            rideRemoved: 'Er is iets misgegaan bij het verwijderen van de rit. Probeer het later opnieuw.',
            reservationRemoved: 'Er is iets misgegaan bij het verwijderen van je deelname aan deze rit. Probeer het later opnieuw.',
        },
    };

    const isSuccess = success === "success";

   return (
       <div className="outer-content-container">
           <div className="inner-content-container">

               <section className="confirmation-container">
                   <h3>{isSuccess ? 'Succes!' : 'Mislukt'}</h3>
                   <p>{isSuccess ? messages.success[type] : messages.failure[type]}</p>
                   <p className="home-page-link">Terug naar de <Link to="/">Homepagina</Link></p>
               </section>

           </div>
       </div>
   );
}
export default Confirmation;